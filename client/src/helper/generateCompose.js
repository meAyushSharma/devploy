export const generateCompose = (dockerfiles) => {
  let dockerCompose = `services:\n\t`;
  dockerfiles?.services?.map((service) => {
    if (service.dockerfileDetails) {
      dockerCompose += `${service?.dockerfileDetails?.name}:\n\t`;
      dockerCompose += `build: .\n\t\t`;
      dockerCompose += `networks:\n\t\t\t`;
      switch (service.dockerfileDetails.driver) {
        case "bridge":
          dockerCompose += `- ${service.dockerfileDetails.bridge}\n`;
          break;
        case "ipvlan":
          dockerCompose += `- ${service.dockerfileDetails.ipvlan.name}\n`;
          break;
        case "macvlan":
          dockerCompose += `- ${service.dockerfileDetails.macvlan.name}\n`;
          break;
        default:
          dockerCompose += ``;
      }
      // ports
      if (service.dockerfileDetails?.ports?.length > 0) {
        dockerCompose += `\t\tports:\n`;
        service.dockerfileDetails.ports.map(
          (port) =>
            (dockerCompose += `\t\t\t- ${port.host}:${port.container}\n`)
        );
      }
    }
  });

  dockerCompose += `networks:\n`;
  const uniqueNetworks = new Map();
  
  dockerfiles.services.forEach((service) => {
    if (service.dockerfileDetails) {
      const { driver } = service.dockerfileDetails;
      let networkName;
  
      switch (driver) {
        case "bridge":
          networkName = service.dockerfileDetails.bridge;
          break;
        case "ipvlan":
          networkName = service.dockerfileDetails.ipvlan?.name;
          break;
        case "macvlan":
          networkName = service.dockerfileDetails.macvlan?.name;
          break;
        default:
          return;
      }
  
      if (networkName && !uniqueNetworks.has(networkName)) {
        uniqueNetworks.set(networkName, driver);
      }
    }
  });
  
  uniqueNetworks.forEach((driver, name) => {
    dockerCompose += `\t${name}:\n`;
    dockerCompose += `\t\tdriver: ${driver}\n`;
  });
  
  return dockerCompose;
};
