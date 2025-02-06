const Docker = require("dockerode");
const docker = new Docker({ socketPath : "/var/run/docker.sock" })
const Environment = require("../models/environmentModel");
const Container = require("../models/containerModel");
const Image = require("../models/imageModel");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");
const tar = require("tar-stream");

module.exports.envDeploy = async (req, res, next) => {
    try {
        const { envId } = req.body;
        if (!envId) return next(new ExpressError("EnvId not provided", statusCodes["Bad Request"], { error: "Missing envId" }));

        const env = await Environment.findUnique({
            where: { userId: req.user.id, id: envId },
            select: { name: true, value: true, id: true }
        });

        if (!env) return next(new ExpressError("Environment not found", statusCodes["Not Found"], { error: "Missing Environment in db fetch" }));

        // 1. get dockerfileDetails
        const dockerfileDetails = JSON.parse(env.value);
        const dockerfile = dockerfileDetails.dockerfile.replace(/\r?\n/g, "\n");

        // 2. check if image already exists
        let imageDetails = null;
        let imageAlreadyExists = false;
        const images = await docker.listImages();
        for (const systemImage of images) {
            for (const systemTag of systemImage.RepoTags || []) {
                if (systemTag === `img-${dockerfileDetails.name}-userid-${req.user.id}-envid-${env.id}:latest`) {
                    imageAlreadyExists = true;
                    break;
                }
            }
            if (imageAlreadyExists) break;
        }

        // 3. if not build one and save in db
        if (!imageAlreadyExists) {
            console.log(`Building image with Dockerfile:\n`, dockerfile);
            
            const pack = tar.pack();
            pack.entry({ name: 'Dockerfile' }, dockerfile, (err) => {
                if (err) return next(new ExpressError("Error processing Dockerfile", statusCodes["Server Error"], { error: err }));
                pack.finalize();
            });

            try {
                await new Promise((resolve, reject) => {
                    docker.buildImage(pack, { t: `img-${dockerfileDetails.name}-userid-${req.user.id}-envid-${env.id}:latest` }, (err, stream) => {
                        if (err) return reject(err);

                        stream.on('data', chunk => {
                            const output = chunk.toString();
                            console.log(output);
                            if (output.includes("error")) reject(new Error("Docker build error detected"));
                        });

                        stream.on('end', () => {
                            console.log('Image built successfully!');
                            resolve();
                        });

                        stream.on('error', (error) => reject(error));
                    });
                });
                const image = await Image.create({
                    data : {
                        name: `img-${dockerfileDetails.name}-userid-${req.user.id}-envid-${env.id}:latest`,
                        user : { connect : { id : req.user.id } },
                        environment : {connect : {id : env.id}}
                    },
                    select : {
                        name: true,
                        id: true,
                        envId: true,
                    }
                });
                imageDetails = image;
                console.log("Here at imageAlreadyExists false: ", imageDetails);
                console.log(`Build and stored image : ${image.name} w/ id: ${image.id}`);
            } catch (err) {
                console.error("Error building image:", err);
                return next(new ExpressError("Failed to build image", statusCodes["Server Error"], { error: err }));
            }
        } else {
            try{
                const image = await Image.findUnique({ 
                    where : { 
                        name: `img-${dockerfileDetails.name}-userid-${req.user.id}-envid-${env.id}:latest`,
                        userId: req.user.id,
                        envId : env.id
                    },
                    select : {
                        id: true,
                        name:true,
                        envId:true,
                    }
                });
                imageDetails = image;
                console.log("Here at imageAlreadyExists true: ", image);
            } catch (err) {
                return next(new ExpressError("Failed to find image", statusCodes["Server Error"], { error: err }));
            }
        }

        // 4. after building image create container, attach to devbox network and start it.
        try {
            const network = await docker.getNetwork("devbox-v0_devbox-network");
            let netName = "bridge";
            if(network.id === "devbox-v0_devbox-network"){
                console.log("Found network: devbox-v0_devbox-network")
                netName = "devbox-v0_devbox-network"
            }
            const container = await docker.createContainer({
                Image: `img-${dockerfileDetails.name}-userid-${req.user.id}-envid-${env.id}:latest`,
                // name: `user-${req.user.id}-envid-${env.id}`,
                Tty: true,
                OpenStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                AttachStdin: true,
                HostConfig: {
                    AutoRemove: false,
                    Memory: 512 * 1024 * 1024,
                    CpuShares: 1024,
                    NetworkMode: netName,
                }
            });
            await container.start();

            // 5. get containerInfo, create container tuple
            const containerInfo = await container.inspect();
            console.log("This is Container info: ", containerInfo.NetworkSettings.Networks[netName]?.IPAddress);
            const exposedPorts = Object.keys(containerInfo.Config.ExposedPorts).map(port => port.split("/")[0]);
            console.log(exposedPorts);
            const containerDB = await Container.create({
                data: {
                    name: containerInfo.Name.substring(1),
                    image : { connect : { id : imageDetails.id } },
                    ipAddress : containerInfo.NetworkSettings.Networks[netName]?.IPAddress,
                    ports : JSON.stringify(exposedPorts)
                },
                select : {
                    name: true,
                    id: true,
                    ports: true,
                    ipAddress: true
                }
            })
            return res.json({
                success: true,
                msg : `Access your services at: ${containerDB.name}.localhost`
            });
        } catch (err) {
            console.error("Error creating container:", err);
            return next(new ExpressError("Failed to create container", statusCodes["Server Error"], { error: err }));
        }
    } catch (err) {
        return next(new ExpressError("Error occurred during envDeploy", statusCodes["Server Error"], { error: err }));
    }
};


