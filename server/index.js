require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { WebSocketServer } = require("ws");
const http = require("http");

const { router } = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
const { reverseProxyService } = require("./services/reverseProxyService");
const { webSocketConnectionOn } = require("./services/websockerService");

const port = process.env.PORT;
const reverseProxyPort = process.env.REVERSE_PROXY_PORT;
const websocketPort = process.env.WEBHOOK_PORT;
const host = process.env.HOST;

const app = express();
const reverseProxyApp = express();
const mainServer = http.createServer();
const wss = new WebSocketServer({ noServer: true });

// wss.on("connection", async (ws, req) => {
//     ws.on("message",(message)=>{
//       console.log(message);
//   })
// })

app.use(cors({ origin:process.env.FRONTEND_BASE_ORIGIN, credentials:true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', router);
app.use(errorHandler);

reverseProxyApp.use(reverseProxyService);
const reverseProxy = http.createServer(reverseProxyApp);

// handle upgrade from http to ws
mainServer.on("upgrade", function upgrade(request, socket, head) {
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
app.listen(port, host, () => {
    console.log(`Server listening on port: ${port} and host: ${host}`);
});

// reverse proxy server
reverseProxy.listen(reverseProxyPort, host, () => {
    console.log(`Reverse proxy listening on port : ${reverseProxyPort} and host: ${host}`);
});

// websocket server
mainServer.listen(websocketPort, host, () => {
    console.log(`Websocket server listening on port: ${websocketPort} w/ host: ${host}`);
})
