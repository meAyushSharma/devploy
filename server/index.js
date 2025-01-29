require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const {router} = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");

const port = process.env.PORT;
const host = process.env.HOST;

const app = express();

app.use(cors({ origin:process.env.FRONTEND_BASE_ORIGIN, credentials:true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', router);
app.use(errorHandler);

app.listen(port, host, () => {
    console.log(`server running successfully on port: ${port} and host: ${host}`);
})
