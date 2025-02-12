const cron = require("node-cron");
const Docker = require("dockerode");
const docker = new Docker({ socketPath : "/var/run/docker.sock" });
const Container = require("./models/containerModel");

// Run every minute to check for expired containers
cron.schedule("* * * * *", async () => {
    // console.log("Checking for expired containers...");
    
    const expiredContainers = await Container.findMany({
        where: { expires_at : { lte: new Date() } }
    });

    for (const dbContainer of expiredContainers) {
        try {
            const container = docker.getContainer(dbContainer.dockerId);
            await container.stop();
            console.log(`Container ${dbContainer.name} stopped automatically.`);
            await container.remove();
            console.log(`Container ${dbContainer.name} removed automatically.`);
            await Container.delete({ where: { id: dbContainer.id } });
            console.log(`Container ${dbContainer.name} deleted from db automatically.`);
        } catch (error) {
            console.error(`Failed to remove container ${dbContainer.name}:`, error.message);
        }
    }
});

console.log("Cron job started and running in the background...");