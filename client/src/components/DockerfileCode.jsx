import { lazy, memo } from "react";
const FormattedCode = lazy(() => import("./FormattedCode"))

const DockerfileCode = memo(({dockerfile, delFun}) => {

    const getNetworkCommand = (dockerfile) => {
        switch(dockerfile.driver){
            case "bridge":
                return `$ docker network create ${dockerfile.bridge}`;
            case "host":
                return `$ docker run -it --network host [image-name](${dockerfile.name})`;
            case "ipvlan":
                return `$ docker network create -d ipvlan ${dockerfile.ipvlan.pairs.map(pair => ` --subnet=${pair.subnet} --gateway=${pair.gateway}`)} -o ipvlan_mode=${dockerfile.ipvlan.mode} -o parent=${dockerfile.ipvlan.parent} ${dockerfile.ipvlan.name}`;
            case "macvlan":
                return `$ docker network create -d macvlan ${dockerfile.macvlan.pairs.map(pair => ` --subnet=${pair.subnet} --gateway=${pair.gateway}`)} -o macvlan_mode=${dockerfile.macvlan.mode} -o parent=${dockerfile.macvlan.parent} ${dockerfile.macvlan.name}`;
            case "none":
                return `$ docker run -it --network none [image-name](${dockerfile.name})`;
            default:
                return `Wrong network driver`
        }
    }
    const getNetName = (dockerfile) => {
        switch(dockerfile.driver){
            case "bridge":
                return dockerfile.bridge;
            case "ipvlan":
                return dockerfile.ipvlan.name ? dockerfile.ipvlan.name : "";
            case "macvlan":
                return dockerfile.macvlan.name ? dockerfile.macvlan.name : "";
            default:
                return `wrong_name`
        }
    }
    // dockerfile is not sent directly beacuse we can show other details here as well
    // const dockerfileJSON = {
    //     dockerfile: dockerfile,
    //     name: input.name,
    //     ports: input.ports,
    //     driver: input.driver,
    //     bridge: input.bridge,
    //     ipvlan: input.ipvlan,
    //     macvlan: input.macvlan,
    //     packageManagers: input.packageManagers,
    //     npm:input.npm,
    //     pip:input.pip,
    //     cargo:input.cargo,
    //     gem:input.gem,
    //     envVariables:input.envVariables
    // }
    return (
    <div className="grid md:grid-cols-[1fr_1fr]">
        <div className="mr-3">
            <FormattedCode code={dockerfile.dockerfile} delFun={delFun ? delFun : ""}/>
        </div>
        <div className="grid font-medium text-gray-700 text-lg h-fit m-2">
            <div className="md:text-2xl h-fit md:my-4">
                Commands to run :
            </div>
            <div className="grid md:gap-2">
                <span className="docker-off-commands">
                    $ docker build -t {dockerfile.name} (.)
                </span>
                <span className="docker-off-commands">
                    {dockerfile.driver && getNetworkCommand(dockerfile)}
                </span>
                <span className="docker-off-commands">
                    $ docker run --network {getNetName(dockerfile)} -it {dockerfile.ports.length>0 && `-p ${dockerfile.ports.map(port => `${port.host} : ${port.container}`)}`} --name cont-name {dockerfile.name}
                </span>
            </div>
        </div>
    </div>
    );
});

export default DockerfileCode;