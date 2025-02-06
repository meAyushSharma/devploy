const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { envDeploy } = require("../controllers/dockerEnvDeployController");
const orchestrationRouter = express.Router();
// const docker = new Docker({ host: 'localhost', port: 2375 });

orchestrationRouter.post('/deploy-env', catchAsync(envDeploy));

module.exports = { orchestrationRouter }