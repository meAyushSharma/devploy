export const generateCompose = (dockerfiles) => {
    let dockerCompose = `services:\n\t`;
    dockerfiles.services.map(service => {
        dockerCompose+= `${service.dockerfileDetails.name}:\n\t`;
        dockerCompose+= `build: .\n\t\t`;
        dockerCompose+= `networks:\n\t\t\t`;
        switch(service.dockerfileDetails.driver){
            case "bridge":
                dockerCompose+= `- ${service.dockerfileDetails.bridge}\n`;
                break;
            case "ipvlan":
                dockerCompose+= `- ${service.dockerfileDetails.ipvlan.name}\n`;
                break;
            case "macvlan":
                dockerCompose+= `- ${service.dockerfileDetails.macvlan.name}\n`;
                break;
            default:
                dockerCompose+= ``;
        }
        // ports
        if(service.dockerfileDetails.ports.length>0) {
            dockerCompose+=`\t\tports:\n`;
            service.dockerfileDetails.ports.map(port => dockerCompose+=`\t\t\t- ${port.host}:${port.container}\n` );
        }
    })

    dockerCompose+=`networks:\n`;
    dockerfiles.services.map(service => {
        switch(service.dockerfileDetails.driver){
            case "bridge":
                dockerCompose+= `\t${service.dockerfileDetails.bridge}:\n`;
                dockerCompose+= `\t\tdriver: bridge\n`
                break;
            case "ipvlan":
                dockerCompose+= `\t${service.dockerfileDetails.ipvlan.name}:\n`;
                dockerCompose+= `\t\tdriver: ipvlan\n`
                break;
            case "macvlan":
                dockerCompose+= `\t${service.dockerfileDetails.macvlan.name}:\n`;
                dockerCompose+= `\t\tdriver: macvlan\n`
                break;
            default:
                dockerCompose+= ``;
        }
    })
    return dockerCompose;
}