const { createContainer } = require("../helper/createContainer");
const { createNetwork } = require("../helper/createNetwork");

module.exports.envDeploy = async (req, res) => {
    const { data } = req.body;
    const jsonData = JSON.parse(data);
    console.log("this is dockerfileJSON: ", jsonData);
    const networkConfig = {
        name : `userId---bridgeNetwork`,
        driver: "bridge"
    }
    const network = await createNetwork(networkConfig);
    const container = await createContainer(jsonData, network, 12355, "sh")
}

