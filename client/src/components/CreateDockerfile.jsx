import { memo, useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getDockerfileFamily } from "../store/selectors/getDockerfilefamily";
import { IoCopy } from "react-icons/io5";
import { Button } from "./common/Button";
import { serviceCountAtom } from "../store/atoms/serviceCountAtom";
import { testDockerfileAtom } from "../store/atoms/testDockerfileAtom";
import { DockerfileCode } from "./DockerfileCode";
import { useNavigate } from "react-router-dom";

export const CreateDockerfile = memo(({type}) => {
    const input = useRecoilValue(getDockerfileFamily(type));
    const generateDockerfile = (input) => {
        const { os, runtimes, databases, packageManagers, npm, pip, cargo, gem, ports, driver, bridge, ipvlan, macvlan, name } = input;
        let dockerfile = `# Dockerfile name : ${name}\n\n`;
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

        // dockerfile += `\n\n\n# Custom dynamically generated Dockerfile\n`;

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

        //5. expose ports
        if(ports && ports.length>0){
            dockerfile += `\n# Exposed ports\n`;
            let exposedPorts=``;
            ports.forEach(port => exposedPorts += ` ${port.container}`);
            dockerfile+=`EXPOSE ${exposedPorts}`
        }

        //6. command for bash
        dockerfile+=`\n# Command for bash\n`;
        dockerfile+=`CMD ["bash"]`;

        return dockerfile;
    }

    const dockerfile = useMemo(() => generateDockerfile(input) , [generateDockerfile, input])
    // creation of dockerfile.json creation
    const dockerfileJSON = {
        dockerfile: dockerfile,
        name: input.name,
        ports: input.ports,
        driver: input.driver,
        bridge: input.bridge,
        ipvlan: input.ipvlan,
        macvlan: input.macvlan,
        packageManagers: input.packageManagers,
        npm:input.npm,
        pip:input.pip,
        cargo:input.cargo,
        gem:input.gem
    }
   
    const [serviceCount, setServiceCount] = useRecoilState(serviceCountAtom);
    const navigator = useNavigate();
    const env = type === "env";
    const [testDockerfile, setTestDockerfile] = useRecoilState(testDockerfileAtom(type));

    const saveEnvToLocal = (folderName, fileName, content) => {
        const worker = new Worker(new URL('../utils/saveEnvDockerfileWorker.js', import.meta.url));
        worker.postMessage({folderName, fileName, content});
        
        worker.onmessage = e => {
            if(e.data.success){
                // clear atoms before directing user to /builds
                console.log("environment data saved successfully to local!");
                // show alert to user
                navigator("/builds")
            }else {
                console.error("the error saving environment data to local is: ", e.data.error);
            }
        }
    }

    const saveProject = () => {
        if(env){
            setTestDockerfile(dockerfileJSON);
            // save to local/server env
            saveEnvToLocal("environment", input.name, dockerfileJSON);
        }else {
            // take it to docker compose for further processes
            setTestDockerfile(dockerfileJSON);
            setServiceCount(count => count+1);
            navigator("/docker-compose");
        }
    }
    return (
        <div>
            <DockerfileCode dockerfile={dockerfileJSON}/>
            <div className="w-fit bg-green-500">
                <Button label={env ? "Save" : "Continue"} onClickFun={saveProject}/>
            </div>
        </div>
    )
})