export const generateDockerfile = (input) => {
    const { os, runtimes, databases, packageManagers, npm, pip, cargo, gem, ports, driver, bridge, ipvlan, macvlan, name, envVariables } = input;
    let dockerfile = `# Dockerfile name : ${name}\n`;
    // add commands for network creation :
    // dockerfile+=`# To create ${driver} network :\n`;
    // switch(driver){
    //     case "bridge":
    //         dockerfile+=`# docker network create ${bridge}`;
    //         break;
    //     case "host":
    //         dockerfile+=`# Simply use it when you run the image\n# docker run -it host <image-name>\n`;
    //         break;
    //     case "ipvlan":
    //         dockerfile+=`# docker network create -d ipvlan ${ipvlan.pairs.map(pair => `\n# --subnet=${pair.subnet} --gateway=${pair.gateway}`)}`
    //         dockerfile+=`\n# -o ipvlan_mode=${ipvlan.mode}\n# -o parent=${ipvlan.parent} ${ipvlan.name}\n`;
    //         break;
    //     case "macvlan":
    //         dockerfile+=`# docker network create -d ipvlan ${macvlan.pairs.map(pair => `\n# --subnet=${pair.subnet} --gateway=${pair.gateway}`)}\n# -o macvlan_mode=${macvlan.mode}\n# -o parent=${macvlan.parent} ${macvlan.name}\n`;
    //         break;
    //     case "none":
    //         dockerfile+=`# Simply use it when you run the image\n# docker run -it --network none <image-name>\n`;
    //         break;
    //     default:
    //         dockerfile+=``;
    // }
    // // add commands for ports

    dockerfile += `\n# Custom dynamically generated Dockerfile\n`;

    //1. add operating system
    dockerfile += os.length>0 ? `FROM ${os[0].value}:latest\n` : `FROM ubuntu:20.04\n`;

    //2. add runtime(s)
    const defaultRuntimes = {
        "npm": "node:16",
        "pip": "python:3.9",
        "cargo": "rust:1.68",
        "gem": "ruby:3.2",
    };

    // remove duplicates
    let runtimesToUse = new Set(runtimes || []);
    let runtimesArray = Array.from(runtimesToUse);

    let pmUsedOnFound = new Set([]);
    if(runtimes && runtimes.length>0){
        runtimesArray.forEach((runtime, index) => {
            dockerfile += `\n#Setup for ${runtime.value}\n`;
            dockerfile += `FROM ${runtime.value}:latest\n`;
            dockerfile += `RUN apt-get update && apt-get install -y curl git && apt-get clean\n#$${index}`;
        });
    }

    //3. add package manager(s) and their respective packages
    const createPackageCommand = (pm) => {
        switch(pm) {
            case "npm":
                if(npm.length>0){
                    let npmPackages = ``;
                    npm.forEach(p => npmPackages += ` ${p.value}`);
                    return `RUN npm install -g ${npmPackages}\n`;
                }
                return ``;
            case "pip":
                if(pip.length>0){
                    let pipPackages = ``;
                    pip.forEach(p => pipPackages += ` ${p.value}`);
                    return `RUN pip install -g ${pipPackages}\n`;
                }
                return ``;
            case "cargo":
                if(cargo.length>0){
                    let cargoPackages = ``;
                    cargo.forEach(p => cargoPackages += ` ${p.value}`);
                    return `RUN cargo install -g ${cargoPackages}\n`;
                }
                return ``;
            case "gem":
                if(gem.length>0){
                    let gemPackages = ``;
                    gem.forEach(p => gemPackages += ` ${p.value}`);
                    return `RUN gem install -g ${gemPackages}\n`;
                }
                return ``;
            default :
                return `# Unsupported package manager: ${pm}\n`;
        }
    }

    const addPackagesToDockerfile = (packageCommand, index) => {
        const newDockerfile = dockerfile.replace(`#$${index}`, packageCommand);
        dockerfile = newDockerfile;
    }

    const checkIfRuntime = (manager) => {
        const regex = manager.split(":")[0];
        const found = runtimesArray.find((runtime, index) => (runtime.value.split("/")[1] || runtime.value) === regex )
        if(found) return {foundRuntime:true, index: runtimesArray.indexOf(found)}
        return { foundRuntime:false, index:-1 };
    }

    if(packageManagers && packageManagers.length>0) {
        packageManagers.forEach(manager => {
            const runtimeForManager = defaultRuntimes[manager.value]; // node:16 => to be used in case of not find
            const { foundRuntime, index } = checkIfRuntime(runtimeForManager);
            const packageCommand = createPackageCommand(manager.value);
            if(foundRuntime){
                pmUsedOnFound.add(manager.value);
                // add to desired location
                packageCommand && addPackagesToDockerfile(packageCommand, index);
            } else {
                // runtime for package not found so 1. delete #$${index} 2. add default runtimes for respective package managers.
                const newDockerfile = dockerfile.replace(/#\$\d+/g, "");
                dockerfile = newDockerfile;
                dockerfile += `\n# Setup for ${manager.value} (default runtime: ${runtimeForManager})\n`;
                dockerfile += `FROM ${runtimeForManager}\n`;
                dockerfile += `RUN apt-get update && apt-get install -y curl git && apt-get clean\n`
                dockerfile += packageCommand || "";
            }
        })
    }


    //4. add database(s)
    if(databases && databases.length>0){
        dockerfile += `\n# Database setup for database(s)\n`;
        databases.forEach(db => dockerfile += `FROM ${db.value}\n`);
    }

    //5. add env variable(s)
    envVariables.length>0 && (dockerfile+=`\n# Environment variables\n`) && envVariables.map(env => dockerfile+=`ENV ${env.envName}=${env.envValue}\n`)

    //6. expose ports
    if(ports && ports.length>0){
        dockerfile += `\n# Exposed ports\n`;
        let exposedPorts=``;
        ports.forEach(port => exposedPorts += ` ${port.container}`);
        dockerfile+=`EXPOSE ${exposedPorts}`
    }

    //7. command for bash
    dockerfile+=`\n# Command for bash\n`;
    dockerfile+=`CMD ["bash"]`;

    return dockerfile;
}