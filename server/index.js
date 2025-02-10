require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { WebSocketServer } = require("ws");
const http = require("http");
const webSocketServer = http.createServer();

const {router} = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
const { reverseProxyService } = require("./services/reverseProxyService");
const { authMiddleware } = require("./middlewares/authMiddleware");
const { webSocketConnectionOn } = require("./services/websockerService");

const port = process.env.PORT;
const reverseProxyPort = process.env.REVERSE_PROXY_PORT;
const websocketPort = process.env.WEBHOOK_PORT;
const host = process.env.HOST;

const app = express();
const reverseProxyApp = express();
const wss = new WebSocketServer({server: webSocketServer});


app.use(cors({ origin:process.env.FRONTEND_BASE_ORIGIN, credentials:true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', router);
app.use(errorHandler);

reverseProxyApp.use(reverseProxyService);
const reverseProxy = http.createServer(reverseProxyApp);

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
webSocketServer.listen(websocketPort, host, () => {
    console.log(`Websocket server listening on port: ${websocketPort} w/ host: ${host}`);
})
