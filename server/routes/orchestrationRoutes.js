const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { envDeploy, getActiveContainers, terminateContainer } = require("../controllers/dockerEnvDeployController");
const orchestrationRouter = express.Router();
// const docker = new Docker({ host: 'localhost', port: 2375 });

orchestrationRouter.post('/deploy-env', catchAsync(envDeploy));
orchestrationRouter.get('/get-active-containers', catchAsync(getActiveContainers));
orchestrationRouter.post('/terminate-service', catchAsync(terminateContainer));

module.exports = { orchestrationRouter }