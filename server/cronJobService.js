const cron = require("node-cron");
const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const { Container, Image } = require("./models/prismaClient");

/* 1. cleanup containers from db and docker after 15+buffer mins of use. */
async function cleanupContainers() {
    try {
        const expiredContainers = await Container.findMany({
            where: { expires_at: { lte: new Date() } }
        });

        for (const dbContainer of expiredContainers) {
            try {
                const container = docker.getContainer(dbContainer.dockerId);
                const containerInfo = await container.inspect();
                
                if (containerInfo.State.Running) {
                    await container.stop();
                    console.log(`Container ${dbContainer.name} stopped automatically.`);
                }
                
                await container.remove({ force: true });
                console.log(`Container ${dbContainer.name} removed automatically.`);

                await Container.delete({ where: { id: dbContainer.id } });
                console.log(`Container ${dbContainer.name} deleted from DB automatically.`);
            } catch (error) {
                console.error(`Error removing container ${dbContainer.name}:`, error.message);
            }
        }
    } catch (error) {
        console.error("Unexpected error during container cleanup:", error);
    }
}

/* 2. cleanup containers that are running in docker but are not in db for more than 30 minutes. */
const WHITELISTED_CONTAINERS = ["devbox-v0-caddy-1", "devbox-v0-server-1", "devbox-v0-worker-1", "devbox-v0-client-1", "devbox-db"];

async function cleanupLongRunningContainers() {
    try {
        const containers = await docker.listContainers({ all: true });

        for (const containerInfo of containers) {
            try {
                const container = docker.getContainer(containerInfo.Id);
                const details = await container.inspect();
                const createdAt = new Date(details.State.StartedAt);
                const elapsedMinutes = (new Date() - createdAt) / 60000;

                if (elapsedMinutes >= 30 && !WHITELISTED_CONTAINERS.includes(containerInfo.Names[0].replace("/", ""))) {
                    console.log(`Stopping and removing container: ${containerInfo.Names[0]}, Uptime: ${elapsedMinutes} min`);

                    if (details.State.Running) {
                        await container.stop();
                        console.log(`Container ${containerInfo.Names[0]} stopped.`);
                    }

                    await container.remove({ force: true });
                    console.log(`Container ${containerInfo.Names[0]} removed.`);
                }
            } catch (error) {
                console.error(`Error processing container ${containerInfo.Names[0]}:`, error.message);
            }
        }
    } catch (error) {
        console.error("Unexpected error during container cleanup:", error);
    }
}

/* 3. cleanup all the images that are not being used by any live containers in db, removal from docker and db */
async function cleanupImages() {
    try {
        const containers = await docker.listContainers({ all: true });
        const dbImages = await Image.findMany();
        const containersUsingImage = new Set(containers.map(cont => cont.Image));

        for (const dbImage of dbImages) {
            try {
                const inUse = containersUsingImage.has(dbImage.name);
                console.log(`Image: ${dbImage.name} - Removal Eligible: ${!inUse}`);

                if (!inUse) {
                    const elapsedMinutes = (new Date() - new Date(dbImage.created_at)) / 60000;
                    if (elapsedMinutes >= 5) {
                        const dockerImage = docker.getImage(dbImage.name);
                        await dockerImage.remove();
                        console.log(`Docker image ${dbImage.name} removed from Docker.`);

                        await Image.delete({ where: { id: dbImage.id } });
                        console.log(`Image ${dbImage.name} removed from DB.`);
                    }
                }
            } catch (err) {
                console.error(`Error removing image ${dbImage.name}:`, err.message);
            }
        }
    } catch (error) {
        console.error("Unexpected error during image cleanup:", error);
    }
}

/* 4. cleanup of unused base images */
async function removeUnusedBaseImages() {
    try {
        const containers = await docker.listContainers({ all: true });
        const images = await docker.listImages();
        const usedImageIds = new Set(containers.map(container => container.ImageID));
        const unUsedImages = images.filter(image => !usedImageIds.has(image.Id));

        for (const image of unUsedImages) {
            try {
                const elapsedMinutes = (new Date() - new Date(image.Created * 1000)) / 60000;
                if (elapsedMinutes >= 10) {
                    console.log(`Removing unused image ${image.Id}, elapsed time: ${elapsedMinutes} min.`);
                    await docker.getImage(image.Id).remove();
                    console.log(`Unused image ${image.Id} removed.`);
                }
            } catch (err) {
                console.error(`Error removing unused image ${image.Id}:`, err.message);
            }
        }

        try {
            const result = await docker.pruneImages();
            console.log("Pruned dangling images:", result);
        } catch (error) {
            console.error("Error pruning images:", error.message);
        }
    } catch (error) {
        console.error("Unexpected error during base image cleanup:", error);
    }
}

/* Schedule cron jobs */
cron.schedule("* * * * *", cleanupContainers);
cron.schedule("* * * * *", cleanupLongRunningContainers);
cron.schedule("* * * * *", cleanupImages);
cron.schedule("*/30 * * * *", removeUnusedBaseImages);

console.log("Cron jobs started and running in the background...");
