export const generateDockerfile = (input) => {
    const { os, runtimes, databases, packageManagers, npm, pip, cargo, gem, ports, driver, bridge, ipvlan, macvlan, name, envVariables, command } = input;
    let dockerfile = `# Dockerfile name : ${name}\n`;
    dockerfile += `\n# Custom dynamically generated Dockerfile\n`;

    //1. add operating system
    dockerfile += os.length>0 ? `FROM ${os[0].value}:${os[0].tag}\n` : `FROM alpine:3.21\n`;
    // dockerfile += `\n# Following command will update system and install necessary dependencies/tools, it is for ubuntu and similar systems, change it accordingly\n`;
    // dockerfile += `\nRUN apt-get update && apt-get install -y curl git && apt-get clean\n`;
    dockerfile += `\n# Creation of non-root user (skip for root priviliges)\n`;
    dockerfile += `RUN (command -v addgroup && addgroup -g 1001 devuser && adduser -D -G devuser -u 1001 devuser) || \
    (command -v groupadd && groupadd -g 1001 devuser && useradd -m -u 1001 -g devuser devuser) || \
    (command -v groupadd && groupadd -r devuser && useradd -r -g devuser devuser) || \
    (command -v pw && pw groupadd devuser && pw useradd devuser -u 1001 -G devuser -m) || \
    (command -v dscl && dscl . -create /Users/devuser UserShell /bin/bash && dscl . -create /Users/devuser UniqueID 1001) || \
    echo "Unsupported OS: Please create the user manually"\n`;
    dockerfile += `\n# Installing git according to operating system\n`;
    dockerfile += `RUN sh -c ' \
    if command -v apk > /dev/null; then apk add --no-cache git; \
    elif command -v apt-get > /dev/null; then apt-get update && apt-get install -y git; \
    elif command -v yum > /dev/null; then yum install -y git; \
    elif command -v dnf > /dev/null; then dnf install -y git; \
    elif command -v pacman > /dev/null; then pacman -Sy --noconfirm git; \
    elif command -v zypper > /dev/null; then zypper install -y git; \
    elif command -v xbps-install > /dev/null; then xbps-install -y git; \
    elif command -v eopkg > /dev/null; then eopkg install -y git; \
    elif command -v pkg > /dev/null; then pkg install -y git; \
    else echo "Unsupported OS: Install Git manually"; exit 1; \
    fi'
    \n`
    dockerfile += `\n#Setting necessary permissions (skip for root priviliges)\n`;
    dockerfile += `RUN mkdir -p /app /app/data && \
    chown -R devuser:devuser /app /app/data && \
    chmod -R 755 /app /app/data\n`
    dockerfile += `\n# Set the working directory to /app\n`;
    dockerfile += `WORKDIR /app\n`
    dockerfile += `\n# Switch to non-root user (skip for root priviliges)\n`;
    dockerfile += `USER devuser\n`;


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
            dockerfile += `FROM ${runtime.value}:${runtime.tag}\n`;
            dockerfile += `\n#$${index}\n`
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
                // dockerfile += `RUN apt-get update && apt-get install -y curl git && apt-get clean\n`
                dockerfile += packageCommand || "";
            }
        })
    }


    //4. add database(s)
    if(databases && databases.length>0){
        dockerfile += `\n# Database setup for database(s)\n`;
        databases.forEach(db => dockerfile += `FROM ${db.value}:${db.tag}\n`);
    }

    //5. add env variable(s)
    envVariables.length>0 && (dockerfile+=`\n# Environment variables\n`) && envVariables.map(env => dockerfile+=`ENV ${env.envName}=${env.envValue}\n`)

    //6. expose ports
    if(ports && ports.length>0){
        dockerfile += `\n# Exposed ports\n`;
        let exposedPorts=``;
        ports.forEach(port => exposedPorts += ` ${port.container}`);
        dockerfile+=`EXPOSE ${exposedPorts}\n`
    }

    //7. command for bash
    dockerfile+=`\n# Command for bash\n`;
    if(command!=""){
        // dockerfile+= `ENTRYPOINT ["/bin/sh", "-c"]\n`;
        // dockerfile+=`CMD /bin/sh -c "${command} & tail -f /dev/null"`;
        dockerfile+=`CMD [${command}]`;
    }else {
        dockerfile+=`CMD ["/bin/sh", "-c", "exec /bin/sh"]`
    }

    return dockerfile;
}