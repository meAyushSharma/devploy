const Docker = require('dockerode');
const stream = require('stream');
const fs = require('fs');

const docker = new Docker({ host: 'localhost', port: 2375 });

module.exports.createContainer = async (dockerfileJSON, networkID, userID, command="sh") => {
    try {
        const dockerfileStream = new stream.Readable();
        dockerfileStream.push(dockerfileJSON.dockerfile);
        dockerfileStream.push(null);

        const imageName = `${dockerfileJSON.name}---${userID}`;
        await new Promise((res, rej) => {
            docker.buildImage(dockerfileStream, {t : imageName}, (err , output) => {
                if(err) return rej(err);
                output.pipe(process.stdout);
                output.on('end', res);
                output.on('error', rej);
            })
        })

        const containerOptions = {
            Image : imageName,
            name: `${dockerfileJSON.name}---${userID}---container`,
            NetworkMode : networkID,
            Resources : {
                Memory: 256*1024*1024,
                CpuShares: 512
            },
            Cmd : command || "sh"
        }
        const container = await docker.createContainer(containerOptions);
        await container.start();
        return container;
    }catch(err) {
        console.error("the error building image is: ", err);
        return null;
    }
}