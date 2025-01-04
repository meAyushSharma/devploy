const express = require("express");
const Docker = require('dockerode');

const dockerRouter = express.Router();
const docker = new Docker({ host: 'localhost', port: 2375 });

dockerRouter.get('/containers', async (req, res) => {
  const containers=await docker.listContainers();
  console.log(containers);
  return res.json({
    containers: containers.map(container => ({id: container.Id, name: container.Names}))
  });
});

module.exports = {dockerRouter}