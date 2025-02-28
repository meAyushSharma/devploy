require("dotenv").config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { registerGlobalErrorHandlers } = require("./services/globalExceptionHandler");
registerGlobalErrorHandlers();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { WebSocketServer } = require("ws");
const http = require("http");

let prisma;
if (!global.prisma) {
    global.prisma = new PrismaClient();
}
prisma = global.prisma;
async function connectDB() {
    try {
        await prisma.$connect();
        console.log("Connected to Neon DB successfully 🚀");
    } catch (error) {
        console.error("Failed to connect to Neon DB ❌", error);
        process.exit(1);
    }
}
connectDB();

const { router } = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
const { reverseProxyService } = require("./services/reverseProxyService");
const { webSocketConnectionOn } = require("./services/websockerService");
const ExpressError = require("./utils/ExpressError");

const port = process.env.PORT || 3007;
const reverseProxyPort = process.env.REVERSE_PROXY_PORT || 3030;
const websocketPort = process.env.WEBHOOK_PORT || 4010;
const host = process.env.HOST || "0.0.0.0";

const app = express();
const reverseProxyApp = express();
const mainServer = http.createServer();
const wss = new WebSocketServer({ noServer: true });

app.use(cors({ origin:process.env.FRONTEND_BASE_ORIGIN, credentials:true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', router);

// other routes handled
app.all("*", (req, res, next) => {
  next(new ExpressError("Route Not Found", 404, { error: "Route not exist"}));
});
app.use(errorHandler);

reverseProxyApp.use(reverseProxyService);
const reverseProxy = http.createServer(reverseProxyApp);

// handle upgrade from https to wss
mainServer.on("upgrade", function upgrade(request, socket, head) {
  console.log("upgrading to ws.......")
    socket.on("error", (err) => {
      console.error(err);
    });
    socket.removeListener("error", (err) => {
      console.error(err);
    });
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit("connection", ws, request);
    });
});
wss.on("connection", webSocketConnectionOn);

// main application server
const mainApp = app.listen(port, host, () => {
    console.log(`Server listening on port: ${port} and host: ${host}`);
});

// reverse proxy server
const proxyApp = reverseProxy.listen(reverseProxyPort, host, () => {
    console.log(`Reverse proxy listening on port : ${reverseProxyPort} and host: ${host}`);
});

// websocket server
const webSocketApp = mainServer.listen(websocketPort, "0.0.0.0", () => {
    console.log(`Websocket server listening on port: ${websocketPort} w/ host: ${host}`);
})

// logging the state
setInterval(() => {
  console.log("Heartbeat: Server is alive...");
}, 30000);

process.on("exit", () => {
  console.log("Server shutting down...");
  mainApp.close(() => {
      console.log("Main server closed");
  });
  proxyApp.close(() => {
      console.log("Reverse proxy server closed");
  });
  webSocketApp.close(() => {
      console.log("Websocket server closed");
  });
});