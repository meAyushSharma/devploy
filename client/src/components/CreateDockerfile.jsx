import { lazy, memo, useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { FaSave } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { VscDebugContinue } from "react-icons/vsc";

import { getDockerfileFamily } from "../store/selectors/getDockerfileFamily";
import { serviceCountAtom } from "../store/atoms/serviceCountAtom";
import { testDockerfileAtom } from "../store/atoms/testDockerfileAtom";
import { useResetEnvAtoms } from "../hooks/useResetEnvAtoms";
import { userModeSelector } from "../store/selectors/userModeSelector"

import { saveToDB } from "../helper/saveToDB";
import { useSaveEnvironment } from "../hooks/useSaveEnvironment";

import { generateDockerfile } from "../helper/generateDockerfile";
import { saveToLocal } from "../helper/saveToLocal";

import Button from "./common/Button";
import { useAlert } from "../hooks/useAlert";
const DockerfileCode = lazy(() => import("./DockerfileCode"));

const CreateDockerfile = memo(({type}) => {
    const {showAlert} = useAlert();
    const input = useRecoilValue(getDockerfileFamily(type));
    // console.log("this is input: ", input)
    const dockerfile = useMemo(() => generateDockerfile(input) , [generateDockerfile, input]);
    const resetEnvAtoms = useResetEnvAtoms();
    const isUserRegistered = useRecoilValue(userModeSelector);
    
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
        envVariables:input.envVariables,
        command:input.command
    }
   
    const [serviceCount, setServiceCount] = useRecoilState(serviceCountAtom);
    const navigator = useNavigate();
    const env = type === "env";
    const [testDockerfile, setTestDockerfile] = useRecoilState(testDockerfileAtom(type));

    const { saveEnvironment, isSaving, saveEnvError, envSaved } = useSaveEnvironment({
        setTestDockerfile,
        resetEnvAtoms,
        setServiceCount,
        saveToDB,
        saveToLocal,
        dockerfileJSON,
        env,
        name: input.name,
        isUserRegistered
    });

    useEffect(() => {envSaved && showAlert("Environment saved successfully (づ￣ 3￣)づ", "info")}, [envSaved]);
    useEffect(() => {saveEnvError && showAlert("Error saving environment (┬┬﹏┬┬)", "error")}, [saveEnvError]);

    return (
        <div className="my-4 border-2 border-violet-500/50 hover:border-violet-500/100 p-2 rounded-lg">
            <DockerfileCode dockerfile={dockerfileJSON}/>
            <div className="w-full">
                <div className="w-fit ml-auto text-xl mr-[3vw]">
                    <Button>
                        {env ? <button onClick={saveEnvironment} 
                        className="flex items-center gap-2 px-1" 
                        style={{cursor:`${isSaving ? "not-allowed" : "pointer"}`, pointerEvents:`${isSaving ? "none" : "auto"}`}}>{!isSaving ? <FaSave/> : <FiLoader className="animate-spin"/>}Save Env</button>
                         : <button className="flex items-center gap-2 px-2" onClick={saveEnvironment}><VscDebugContinue/>Continue</button>}
                    </Button>
                </div>
            </div>
        </div>
    )
})

export default CreateDockerfile;