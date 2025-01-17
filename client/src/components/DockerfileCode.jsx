import { memo } from "react";
import { FormattedCode } from "./FormattedCode";

export const DockerfileCode = memo(({dockerfile, delFun}) => {
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
    <div className="my-4 flex">
        <div>
            <FormattedCode code={dockerfile.dockerfile} delFun={delFun ? delFun : ""}/>
        </div>
        <div>
            
        </div>
    </div>
    );
});