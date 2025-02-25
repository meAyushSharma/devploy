const cron = require("node-cron");
const Docker = require("dockerode");
const docker = new Docker({ socketPath : "/var/run/docker.sock" });
const Container = require("./models/containerModel");
const Image = require("./models/imageModel");

cron.schedule("* * * * *", async () => {
    
    const expiredContainers = await Container.findMany({
        where: { expires_at : { lte: new Date() } }
    });

    for (const dbContainer of expiredContainers) {
        try {
            const container = docker.getContainer(dbContainer.dockerId);
            // console.log((await container.inspect()).State);
            if((await container.inspect()).State.Running) {
                await container.stop();
                console.log(`Container ${dbContainer.name} stopped automatically.`);
            }
            await container.remove({ force: true });
            console.log(`Container ${dbContainer.name} removed automatically.`);
            await Container.delete({ where: { id: dbContainer.id } });
            console.log(`Container ${dbContainer.name} deleted from db automatically.`);
        } catch (error) {
            console.error(`Failed to remove container ${dbContainer.name}:`, error.message);
        }
    }

    try {
        // const images = (await docker.listImages()).map(image => (new Date() - new Date(image.Created*1000))/60000);
        // console.log("This is images: ", images);
        // remove images based on 
        const containers = await docker.listContainers({all: true});
        const dbImages = await Image.findMany();
        const containersUsingImage = containers.map(cont => cont.Image);
        for(const dbImage of dbImages) {
            const inUse = containersUsingImage.includes(dbImage.name)
            console.log(`Image : ${dbImage.name} to remove : ${!inUse}`);
            if(!inUse) {
                const elapsedMinutes = (new Date() - new Date(dbImage.created_at)) / 60000;
                if(elapsedMinutes >= 5) {
                    try {
                        const dockerImage = docker.getImage(dbImage.name);
                        await dockerImage.remove();
                        console.log(`Docker image: ${dbImage.name} got removed from docker automatically successfully.`);
                        await Image.delete({ where: { id: dbImage.id }});
                        console.log(`Image : ${dbImage.name} got deleted from database automatically successfully.`)
                    } catch (err) {
                        console.error(`Failed to remove image ${dbImage.name}:`, err);
                    }
                }
            }
        }
    } catch (err){
        console.log("Error during automatic image deletion is: ", err)
    }
});

cron.schedule("*/30 * * * *", async () => {
    // automatic removal of unused base docker images
    const containers = await docker.listContainers({all: true});
    const images = await docker.listImages();
        const usedImageIds = new Set(containers.map(container => container.ImageID));
        const unUsedImages = images.filter(image => !usedImageIds.has(image.Id));
        for(const image of unUsedImages) {
            console.log("Created time is: ", image.Created);
            const elapsedMinutes = (new Date() - new Date(image.Created * 1000)) / 60000;
            console.log(`Elapsed time for removal in mins is: ${elapsedMinutes}`);
            if(elapsedMinutes >= 10) {
                try {
                    console.log(`Removing unused image after 5 min of wait: ${image.Id}`);
                    await docker.getImage(image.Id).remove();
                } catch (err) {
                    console.error(`Failed to remove image ${image.Id}:`, err);
                }
            }
            console.log('Unused images removed successfully.');
        }
        try {
            const result = await docker.pruneImages();
            console.log("Dangling images removed:", result);
        } catch (error) {
            console.error("Error pruning images:", error.message);
        }
})

console.log("Cron job started and running in the background...");