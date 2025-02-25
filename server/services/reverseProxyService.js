const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxy({});
const Container = require("../models/containerModel");
const statusCodes = require("../utils/statusCodes");
const ExpressError = require("../utils/ExpressError");
const jwt = require("jsonwebtoken");

module.exports.reverseProxyService = async (req, res) => {
    try {
        const hostname = req.hostname;
        const subDomainParts = hostname.split('.');
        const subDomain = subDomainParts[0];
        console.log("Hostname: ", hostname);
        console.log("Subdomain: ", subDomain);
        const token = req.query.token;
        if(!token) {
            return res.status(statusCodes.Unauthorized).json({
                success: false,
                message: "Unauthorized User Request Denied"
            })
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if(!user) {
            return res.status(statusCodes.Unauthorized).json({
                success: false,
                message: "Unauthorized User Request Denied",
                error: "Invalid Auth Token"
            })
        }
        console.log(`${subDomain.split("-")[0]}-user-${user.id}`);
        const container = await Container.findFirst({
            where : {
                name: `${subDomain.split("-")[0]}-user-${user.id}`
            },
            select : {
                ipAddress: true,
                ports: true,
                name: true,
            }
        });
        console.log("this is container: ", container);
        if(!container) {
            return res.status(statusCodes["Bad Request"]).json({
                success : false,
                msg: "Container not found",
            });
        }
        const exposedPorts = JSON.parse(container.ports); /* array of ports */
        try {
            if(exposedPorts.length){
                let requestedPort = exposedPorts[0];
                if(subDomain.split("-").length > 1) {
                    const possiblePort = subDomainParts[0].split("-")[1];
                    console.log("possible port: ", possiblePort);
                    if (exposedPorts.includes(possiblePort)) {
                        requestedPort = possiblePort;
                    }
                };
                // const target = `http://${container.ipAddress}:${requestedPort}`;
                // because inside docker, containers are running w/ their generated names only
                const target = `http://${subDomain.split("-")[0]}.devbox-v0_devbox-network:${requestedPort}`;
                console.log(`Forwarding ${hostname} --> ${target}`);
                proxy.web(req, res, {target: target, changeOrigin: true});
                proxy.on("error", (err, req, res) => {
                    console.error(`Proxy error: ${err.message}`);
                    console.log("Proper error is this: ", err)
                    if (!res.headersSent) {
                        // res.writeHead(statusCodes["Server Error"], { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            success: false,
                            message: "Proxy error: Unable to reach the target service",
                            error: err.message
                        }));
                    }
                });
                
            }
        } catch(err) {
            console.log(`Error during reverse proxy is : ${err.message}`);
            throw new ExpressError("Some error occured in reverse proxy", statusCodes["Server Error"], {error: err.message});
        }

    } catch (err) {
        console.log("the error is: ", err);
        return res.status(statusCodes["Server Error"]).json({
            success: false,
            msg:"Some Error occured at reverse proxy"
        })
    }
}