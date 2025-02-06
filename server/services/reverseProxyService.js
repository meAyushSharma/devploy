const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxy({});
const Container = require("../models/containerModel");
const statusCodes = require("../utils/statusCodes");

module.exports.reverseProxyService = async (req, res) => {
    try {
        const hostname = req.hostname;
        const subDomainParts = hostname.split('.');
        const subDomain = subDomainParts[0];
        console.log("Hostname: ", hostname);
        console.log("Subdomain: ", subDomain);
        const container = await Container.findUnique({
            where : {
                name: subDomain
            },
            select : {
                ipAddress: true,
                ports: true,
            }
        });
        if(!container) {
            return res.status(statusCodes["Bad Request"]).json({
                success : false,
                msg: "Container not found",
            });
        }
        const exposedPorts = JSON.parse(container.ports); /* array of ports */
        if(exposedPorts.length){
            const requestedPort = exposedPorts[0];
            if(subDomainParts.length > 1) {
                const possiblePort = subDomainParts[1].split("-")[1];
                if (exposedPorts.includes(possiblePort)) {
                    requestedPort = possiblePort;
                }
            };
            // const target = `http://${container.ipAddress}:${requestedPort}`;
            const target = `http://${subDomain}.devbox-v0_devbox-network:${requestedPort}`;
            console.log(`Forwarding ${hostname} --> ${target}`);
            proxy.web(req, res, {target: target, changeOrigin: true});
        }
    } catch (err) {
        console.log("the error is: ", err);
        return res.status(statusCodes["Server Error"]).json({
            success: false,
            msg:"Some Error occured at reverse proxy"
        })
    }
}