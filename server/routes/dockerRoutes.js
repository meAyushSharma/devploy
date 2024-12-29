const express = require("express");
const fs = require('fs');
const path = require('path');
const Docker = require("dockerode");
var docker = new Docker({ socketPath: "/var/run/docker.sock" });
const dockerRouter = express.Router();

dockerRouter.get("/start", async (req, res) => {
    const dockerfilePath = path.resolve(__dirname, 'Dockerfile');
    const tar = require('tar-fs');

    // Create a tarball of the context (assuming Dockerfile is in the current folder)
    const tarStream = tar.pack(__dirname);

    try {
        console.log("Building Docker image...");
        const stream = await docker.buildImage(tarStream, {
            t: 'devboxTestImage', // Tag the image
        });

        // Stream progress logs
        stream.pipe(process.stdout);
        await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream, (err, res) =>
                err ? reject(err) : resolve(res)
            );
        });

        console.log('Docker image built successfully as "devboxTestImage".');
    } catch (error) {
        console.error('Error building Docker image:', error);
    }

    res.send("successfull...");
});

module.exports = { dockerRouter };
