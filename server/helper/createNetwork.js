const Docker = require('dockerode');
const docker = new Docker({ host: 'localhost', port: 2375 });

module.exports.createNetwork = async (networkConfig) => {
    try {
        const network = await docker.createNetwork({
            Name: networkConfig.name,
            Driver: networkConfig.driver,
        })
        return network;
    }catch(err) {
        console.error("the error creating network is: ", err);
        return null;
    }
}