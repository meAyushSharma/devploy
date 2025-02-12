const docker = require("../utils/dockerInstance");
const statusCodes = require("../utils/statusCodes");

module.exports.dockerCommandExecHelper = async ({chunk, containerID, wsConnection}) => {
    if(!chunk || !containerID) {
        console.log("No command or containerID provided");
        wsConnection.send("No command or containerID provided");
        // wsConnection.close(statusCodes["Ws Policy Violation"]);
    }
    try {
        const command = chunk.toString();
        console.log("This is command: ", command);
        console.log("This is containerID: ", containerID);
        const container = docker.getContainer(containerID);
        // if(!container) {
        //     console.log("No container found for command exectution");
        //     wsConnection.send("No container found for command exectution");
        //     // wsConnection.close(statusCodes["Ws Forbidden"]);
        // }
        const exec = await container.exec({
            Cmd: ["/bin/sh"],
            AttachStdin: true,
            AttachStdout: true,
            User: "root",
            Tty: true,
          });
        const stream = await exec.start({ stdin: true, hijack: true, Detach: false });
          // message from container to client
  stream.on("data", (data) => {
    console.log("Data to string: ", data.toString());
    wsConnection.send(data.toString());
  });
  // Message from client to container
  wsConnection.on("message", (msg) => {
    console.log("Message from user: ", msg.toString());
    stream.write(msg);
  });
        // let output = "";
        // stream.on("data", (chunk) => {
        //     output += chunk.toString();
        // });

        // stream.on("end", () => {
        //     console.log(`Output: ${output}`);
        //     wsConnection.send(output || "Command executed successfully.");
        // });
    } catch (error) {
        console.error("Docker Exec Error:", error);
        wsConnection.send(`Error: ${error.message}`);
    }
}