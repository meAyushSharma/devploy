import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MdDelete } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5"

import Button from "../components/common/Button";
import DockerfileCode from "../components/DockerfileCode";

import { useDebounce } from "../hooks/useDebounce";
import { useResetAllAtoms } from "../hooks/useResetAllAtoms";
import { useWorkerValidName } from "../hooks/useWorkerValidName";
import { dockerfileSelector } from "../store/selectors/dockerfileSelector";
import { serviceDelTrackerAtom } from "../store/atoms/serviceDelTrackerAtom";

import { saveToLocal } from "../helper/saveToLocal";
import { generateCompose } from "../helper/generateCompose";



const DockerCompose = () => {
    // obviously type=service
    const navigate = useNavigate();
    //* handle project name : project name of docker compose is not global variable, so handle while keeping it in mind
    const [projName, setProjName] = useState("my-project");
    const debouncedName = useDebounce(projName, 1000);
    const nameIsValid = useWorkerValidName({workerPath:'../worker/dockerComposeFolderDuplicacy.js', debouncedName, type:"service"});  // check folderName duplicacy
    const [isTouched, setIsTouched] = useState(false);
    const handleBlur = () => setIsTouched(true);
    
    const dockerfiles = useRecoilValue(dockerfileSelector); // dockerfiles:{environment:JSON, services:[{ dockerfileDetails:JSON, name:'useless' }]}
    const composeFile = generateCompose(dockerfiles);
    // handle service deletion
    const setServiceDelTracker = useSetRecoilState(serviceDelTrackerAtom);
    const delService = (index) => setServiceDelTracker(prevState => [...prevState, index]);

    // debugging purpose only 
    console.log("this is dockerfiles: ", dockerfiles);
    const n = dockerfiles.services.length;
    const resetAllAtoms = useResetAllAtoms(n);


    // save compose to local
    const saveCompose = async () => {
        if (!nameIsValid) return;
        try {
            const composeObj = {
                workerPath: '../worker/saveDockerComposeDockerfileWorker.js',
                parentFolderName: "docker-compose",
                fileName: "docker-compose",
                content: composeFile,
                childFolderName: debouncedName,
            };
            const savePromises = dockerfiles.services.map(async (service) => {
                if(service.dockerfileDetails){
                    const obj = {
                        workerPath: '../worker/saveDockerComposeDockerfileWorker.js',
                        parentFolderName: "docker-compose",
                        fileName: service.dockerfileDetails.name,
                        content: service.dockerfileDetails,
                        childFolderName: debouncedName,
                    };
                    return saveToLocal(obj);
                }
                return null;
            });
            // save compose
            await saveToLocal(composeObj);
            const results = await Promise.all(savePromises);
            if (results.every(event => event?.data?.success)) {
                resetAllAtoms();
                navigate("/builds#compose");
            }else console.error("One or more saves failed");
        } catch (err) {
            console.error("Error in saveCompose: ", err);
        }
    };
    

    return (
        <div className="font-Satoshi m-5 bg-soft-white">
            <div className="flex items-center">
                <span className="text-xl font-medium text-gray-700">Project name : </span>
                <input 
                type="text"
                onBlur={handleBlur}
                onChange={e => setProjName(e.target.value.trim())}
                value={projName}
                className={`border rounded text-lg font-medium px-2 text-center mx-4 ${projName ? 'border-blue-500':'border-rose-500 mx-2'} enabled:hover:border-gray-400`}
                />
                {!projName && isTouched && (
                    <div className="flex gap-1 items-center mr-4">
                        <IoInformationCircleOutline className="text-rose-500"/>
                        <span className="text-rose-500 text-sm">This field is required</span>
                    </div>
                )}
                {projName && !nameIsValid && (
                <div className="flex gap-1 items-center">
                    <IoInformationCircleOutline className="text-rose-500"/>
                    <span className="text-rose-500 text-sm">Name alredy exists</span>
                </div>
                )}
                {/* {"Button to add services"} */}
            </div>
            <div className="max-w-[10%] m-auto">
                <Button label={"Add Service"} onClickFun={() => navigate("/create-service")}/>
            </div>
            <div>
                {/* {"this will come from  local storage "} */}
                {dockerfiles.services.length > 0 && dockerfiles.services.map((service,key) => 
                    service.dockerfileDetails && (<div key={key} className="my-4 border-2 border-violet-500/50 hover:border-violet-500/100 p-2 rounded-lg">
                        <div className="flex items-center m-4">
                            <span className="text-xl font-medium text-gray-500">Service Name : </span>
                            <span className="text-xl font-medium text-gray-500 px-2 mr-4">{service.dockerfileDetails.name}</span>
                            {/* <Button label={"Delete Service"} onClickFun={() => delService(key)}/> */}
                            <MdDelete onClick={() => delService(key)} className="cursor-pointer mx-2 text-xl text-slate-500 hover:text-slate-500/80"/>
                        </div>
                        <DockerfileCode dockerfile={service.dockerfileDetails}/>
                    </div>)
                    )}
            </div>
            <div className="max-w-[10%] m-auto">
                <Button label={"Save"} onClickFun={saveCompose}/>
            </div>
        </div>
    )
}

export default DockerCompose;