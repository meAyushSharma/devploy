const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { envDeploy } = require("../controllers/dockerEnvDeployController");
const dockerRouter = express.Router();
// const Docker = require('dockerode');
// const docker = new Docker({ host: 'localhost', port: 2375 });

// dockerRouter.get('/containers', async (req, res) => {
//   const containers=await docker.listContainers();
//   console.log(containers);
//   return res.json({
//     containers: containers.map(container => ({id: container.Id, name: container.Names}))
//   });
// });

dockerRouter.post('/deploy-env', catchAsync(envDeploy));

module.exports = { dockerRouter }