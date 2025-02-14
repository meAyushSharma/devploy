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
            await container.remove();
            console.log(`Container ${dbContainer.name} removed automatically.`);
            await Container.delete({ where: { id: dbContainer.id } });
            console.log(`Container ${dbContainer.name} deleted from db automatically.`);
        } catch (error) {
            console.error(`Failed to remove container ${dbContainer.name}:`, error.message);
        }
    }

    try {
        const dbImages = await Image.findMany();
        const containers = docker.listContainers();
        // const images = docker.listImages();
        for(const dbImage of dbImages) {
            const inUse = (await containers).some(container => container.Image === dbImage.name);
            if(!inUse) {
                const dockerImage = docker.getImage(dbImage.name);
                await dockerImage.remove();
                console.log(`Docker image: ${dbImage.name} got removed from docker automatically successfully.`);
                await Image.delete({ where: { id: dbImage.id }});
                console.log(`Image : ${dbImage.name} got deleted from database automatically successfully.`)
            }
        }
        const images = await docker.listImages();
        // console.log("This is images: ", images);
        for(const image of images) {
            console.log("image: ", image);
            const inUse = (await containers).some(container => container.Image === image.RepoTags[0]);
            if(!inUse) {
                const removableImage = docker.getImage(image.Id);
                await removableImage.remove();
                console.log(`Docker image: ${image.RepoTags[0]} got removed from docker automatically successfully.`);
            }
        }
    } catch (err){

    }

    // const image = docker.getImage("sha256:385c418cf9461cd92e0d39b00b9762ddbac01cf77a2a0b400b37e092b6e22fbf");
    // console.log("This is image: ",image);
});

console.log("Cron job started and running in the background...");