import { memo, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getDockerfileFamily } from "../store/selectors/getDockerfilefamily";
import { Button } from "./common/Button";
import { serviceCountAtom } from "../store/atoms/serviceCountAtom";
import { testDockerfileAtom } from "../store/atoms/testDockerfileAtom";
import { DockerfileCode } from "./DockerfileCode";
import { useNavigate } from "react-router-dom";
import { generateDockerfile } from "../helper/generateDockerfile";
import { saveToLocal } from "../helper/saveToLocal";
import { useResetEnvAtoms } from "../hooks/useResetEnvAtoms";

export const CreateDockerfile = memo(({type}) => {
    const input = useRecoilValue(getDockerfileFamily(type));
    console.log("this is input: ", input)
    const dockerfile = useMemo(() => generateDockerfile(input) , [generateDockerfile, input]);
    const resetEnvAtoms = useResetEnvAtoms();
    
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
        gem:input.gem,
        envVariables:input.envVariables
    }
   
    const [serviceCount, setServiceCount] = useRecoilState(serviceCountAtom);
    const navigator = useNavigate();
    const env = type === "env";
    const [testDockerfile, setTestDockerfile] = useRecoilState(testDockerfileAtom(type));


    const saveProject = async () => {
        if(env){
            console.log("at save project")
            setTestDockerfile(dockerfileJSON);
            const obj = {
                workerPath:'../worker/saveEnvDockerfileWorker.js',
                parentFolderName:"environment",
                fileName: input.name,
                content: dockerfileJSON,
                childFolderName:"default"
            }
            const event = await saveToLocal(obj);
            if(event.data.success){
                console.log("Successfully saved env data on local");
                resetEnvAtoms();
                navigator("/builds#env");
            } else console.error("the error saving environment data to local is: ", event.data.error);
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
            <div className="w-fit">
                <Button label={env ? "Save" : "Continue"} onClickFun={saveProject}/>
            </div>
        </div>
    )
})