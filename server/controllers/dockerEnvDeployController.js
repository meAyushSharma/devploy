const Docker = require("dockerode");
const docker = new Docker({ socketPath : "/var/run/docker.sock" });
const Environment = require("../models/environmentModel");
const Container = require("../models/containerModel");
const Image = require("../models/imageModel");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");
const tar = require("tar-stream");
const User = require("../models/userModel");

module.exports.envDeploy = async (req, res, next) => {
    try {
        const { envId } = req.body;
        if (!envId) return next(new ExpressError("EnvId not provided", statusCodes["Bad Request"], { error: "Missing envId" }));
        if (!req.user) return next(new ExpressError("User unauthorized", statusCodes.Unauthorized, { error: "Missing user" }));

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
                if (systemTag === `img-${dockerfileDetails.name}-user-${req.user.id}-env-${env.id}:latest`) {
                    console.log("System tag is: ", systemTag);
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
                    docker.buildImage(pack, { t: `img-${dockerfileDetails.name}-user-${req.user.id}-env-${env.id}:latest` }, (err, stream) => {
                        if (err) return reject(err);
                        stream.on('data', chunk => {
                            const output = chunk.toString();
                            console.log("Output of image building: ", output);
                            if (output.includes("error")) reject(new Error("Docker build error detected"));
                        });

                        stream.on('end', () => {
                            console.log('Image built successfully!');
                            resolve();
                        });
                        stream.on('error', (error) => reject(error));
                    });
                });
                const imageInfo = await docker.getImage(`img-${dockerfileDetails.name}-user-${req.user.id}-env-${env.id}:latest`);
                const imageId = (await imageInfo.inspect()).Id;
                const image = await Image.create({
                    data : {
                        name: `img-${dockerfileDetails.name}-user-${req.user.id}-env-${env.id}:latest`,
                        user : { connect : { id : req.user.id } },
                        environment : {connect : {id : env.id}},
                        dockerId: imageId.split(":")[0]
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
                const image = await Image.findFirst({ 
                    where : { 
                        name: `img-${dockerfileDetails.name}-user-${req.user.id}-env-${env.id}:latest`,
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
            if(!imageDetails) return next(new ExpressError("Image not found => not in db but in docker", statusCodes.Forbidden, { error : "Image not found"}));
            const container = await docker.createContainer({
                Image: `img-${dockerfileDetails.name}-user-${req.user.id}-env-${env.id}:latest`,
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
                    ReadonlyRootfs: false,
                    CapDrop: ["All"],
                    SecurityOpt: ["no-new-privileges"],
                    Privileged: false,
                },
                Volumes: {},
            });
            await container.start();
            const containerInfo = await container.inspect();
            // 5. get containerInfo, create container tuple
            // console.log("This is Container info: ", containerInfo.NetworkSettings.Networks[netName]?.IPAddress);
            const exposedPorts = containerInfo.Config.ExposedPorts ? Object.keys(containerInfo.Config.ExposedPorts).map(port => port.split("/")[0]) : [];
            console.log("ExposedPorts: ", exposedPorts);
            const createdAt = new Date();  // Current timestamp
            const expiresAt = new Date(createdAt.getTime() + 16 * 60 * 1000);
            const containerDB = await Container.create({
                data: {
                    name: `${containerInfo.Name.substring(1)}-user-${req.user.id}`,
                    image : { connect : { id : imageDetails.id } },
                    ipAddress : containerInfo.NetworkSettings.Networks[netName]?.IPAddress,
                    ports : JSON.stringify(exposedPorts),
                    user : { connect : { id : req.user.id } },
                    dockerId : containerInfo.Id,
                    created_at: createdAt,
                    expires_at: expiresAt
                },
                select : {
                    name: true,
                    id: true,
                    ports: true,
                    ipAddress: true,
                    userId: true,
                    dockerId: true,
                }
            })
            // const urls = exposedPorts.map(port => `${containerDB.name.split("-")[0]}-${port}.localhost`);
            return res.json({
                success: true,
                msg : `Successfully deployed service ${containerDB.name.split("-")[0]}`
            });
        } catch (err) {
            console.error("Error creating container:", err);
            return next(new ExpressError("Failed to create container", statusCodes["Server Error"], { error: err }));
        }
    } catch (err) {
        return next(new ExpressError("Error occurred during envDeploy", statusCodes["Server Error"], { error: err }));
    }
};


module.exports.getActiveContainers = async (req, res, next) => {
    try {
        if(!req.user) return next(new ExpressError("User unauthorized", statusCodes.Unauthorized, { error: "Missing user" }));
        const activeContainerDetails = await User.findMany({
            relationLoadStrategy:"join",
            where : {
                id: req.user.id
            },
            select : {
                containers : {
                    select : {
                        id:true,
                        name:true,
                        created_at:true,
                        ports:true,
                        userId:true,
                        dockerId: true,
                        image : {
                            select : {
                                id : true,
                                name :true,
                                dockerId:true,
                                environment : {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if(!activeContainerDetails) return next(new ExpressError("No containers found active", statusCodes["Not Found"], { error : "No active containers found"}));
        const containers = activeContainerDetails[0].containers;
        console.log(`Active containers of user: ${req.user.id} are: `, containers);
        res.json({
            success:true,
            containers
        })
    } catch (err) {
        return next(new ExpressError("Error occurred during getting active containers", statusCodes["Server Error"], { error: err }));
    }
}

module.exports.terminateContainer = async (req, res, next) => {
    const { imgId, contId, contDockerId, imgDockerId } = req.body;
    if(!imgId || !contId || !contDockerId || !imgDockerId) return next(new ExpressError("imgId || contId || contDockerId || imgDockerId not provided", statusCodes["Bad Request"], { error: "Missing imgId || contId || contDockerId || imgDockerId" }));
    if (!req.user) return next(new ExpressError("User unauthorized", statusCodes.Unauthorized, { error: "Missing user" }));
    try {
        const container = docker.getContainer(contDockerId);
        const containerInfo = await container.inspect();
        console.log(`Container found: ${containerInfo.Name}`);
        if (containerInfo.State.Running) {
            console.log(`Stopping container ${contDockerId}...`);
            await container.stop();
        }
        console.log(`Removing container ${contDockerId}...`);
        await container.remove();
        console.log(`Container ${contDockerId} deleted successfully.`);

        const dbContainer = await Container.delete({
            where : {
                id: contId,
                imageId: imgId
            },
            select : {
                id: true,
                dockerId: true,
            }
        })
        return res.status(statusCodes.Ok).json({
            success: true,
            msg:`Successfully terminated service : ${dbContainer.id} with dockerId : ${dbContainer.dockerId}`
        })
    } catch(err) {
        return next(new ExpressError(`Error occurred during termination of container contId : ${contId}`, statusCodes["Server Error"], { error: err }));
    }
}
