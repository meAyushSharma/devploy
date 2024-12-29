require("dotenv").config();
const express = require("express");
const cors = require("cors");

const {router} = require("./routes/index");

const port = process.env.PORT;
const host = process.env.HOST;

const app = express();
app.use('/api/v1', router);
app.listen(port, host, () => {
    console.log(`server running successfully on port: ${port} and host: ${host}`);
})
