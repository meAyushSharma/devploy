const jwt = require("jsonwebtoken");
const url = require("url");
const docker = require("../utils/dockerInstance");
const statusCodes = require("../utils/statusCodes");
const { dockerCommandExecHelper } = require("../helper/dockerCommandExecHelper");

module.exports.webSocketConnectionOn = async (ws, req) => { 
        console.log(req.headers.origin);
        const { token, contId } = url.parse(req.url, true).query;
        if(!token){
            console.log("❌ Closing connection: Missing token");
            ws.send("Unauthorized access denied");
            return;
        }
        if(!contId) {
            console.log("❌ Closing connection: Missing contId");
            ws.send("Unauthorized access denied");
            return;
        }
    
        try {
            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            if(!verifiedToken){
                console.log("Unauthorized user access denied");
                ws.send("Unauthorized access denied");
                return;
            }
        }  catch (err) {
            console.log("Error during token verification: ", err.message);
            ws.send("Unauthorized access denied");
            return;
        }
        console.log("Token: ", token);
        console.log("contId: ", contId);
        // const CONTAINER_ID = "246f8224ba0d130ae9842e06f854f58e193324a82b118aa167dc4c129b9ecdba";
        const CONTAINER_ID = contId;
        //   const container = docker.getContainer(CONTAINER_ID);
        //   console.log("Container name is: ", (await container.inspect()).Name);
        //   console.log("OPENED");
        //   const stream = await container.attach({ stream: true, stdout: true, stderr: true });
        //   stream.on("data", (data) => {
        //     console.log("Streamed data: ", data.toString());
        //     ws.send(data.toString());
        //   });
        // ws.on("close", () => {
        //     console.log("Client disconnected");
        //     stream.destroy();
        // });
        try {
            const container = docker.getContainer(CONTAINER_ID);
            console.log("Container name is: ", (await container.inspect()).Name);
            const exec = await container.exec({
                Cmd: ["/bin/sh"],
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
            });
        
            const stream = await exec.start({ stdin: true, hijack: true });
        
            // Send the container's output to the WebSocket
            stream.on("data", (data) => {
                ws.send(data.toString());
            });
        
            // Receive commands from the WebSocket and write to the container
            ws.on("message", (msg) => {
                console.log("Command received:", msg.toString());
                stream.write(msg + "\n"); // Append newline so command executes
            });
        
            ws.on("close", () => {
                console.log("Client disconnected");
                stream.destroy();
            });
        
        } catch (error) {
            console.error("Error attaching to container:", error);
            ws.send(`Error: ${error.message}`);
        }
}




