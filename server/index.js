require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

const {router} = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
const { reverseProxyService } = require("./services/reverseProxyService");

const port = process.env.PORT;
const host = process.env.HOST;
const reverseProxyPORT = process.env.REVERSE_PROXY_PORT;

const app = express();
const reverseProxyApp = express();

app.use(cors({ origin:process.env.FRONTEND_BASE_ORIGIN, credentials:true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', router);
app.use(errorHandler);

reverseProxyApp.use(reverseProxyService);
const reverseProxy = http.createServer(reverseProxyApp);

reverseProxy.listen(reverseProxyPORT, host, () => {
    console.log(`Reverse proxy listening on port : ${reverseProxyPORT} and host: ${host}`);
});

app.listen(port, host, () => {
    console.log(`Server listening on port: ${port} and host: ${host}`);
});
