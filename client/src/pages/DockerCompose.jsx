import { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { dockerfileSelector } from "../store/selectors/dockerfileSelector";
import { DockerfileCode } from "../components/DockerfileCode";
import { serviceDelTrackerAtom } from "../store/atoms/serviceDelTrackerAtom";
import { useDebounce } from "../hooks/useDebounce";
import { dockerComposeFolderDuplicacy } from "../utils/dockerComposeFolderDuplicacy";

export const DockerCompose = () => {
    // obviously type=service
    //* handle project name : project name of docker compose is not global variable, so handle while keeping it in mind
    const [projName, setProjName] = useState("my-project");
    const debouncedName = useDebounce(projName, 1000);
    const [nameIsValid, setNameIsValid] = useState(null);
    const [isTouched, setIsTouched] = useState(false);
    const handleBlur = () => setIsTouched(true);
    const navigate = useNavigate();
    const dockerfiles = useRecoilValue(dockerfileSelector);


    // check folderName duplicacy
    useEffect(() => {
        const fetchNames = async () => {
            const dcFolderNames = await dockerComposeFolderDuplicacy();
            console.log("this is dcFolderNames: ", dcFolderNames);
            if(dcFolderNames.includes(debouncedName)) setNameIsValid(false);
            else setNameIsValid(true);
        }
        debouncedName && fetchNames();
    }, [debouncedName, setNameIsValid, dockerComposeFolderDuplicacy])


    // handle service deletion
    const setServiceDelTracker = useSetRecoilState(serviceDelTrackerAtom);
    const delService = (index) => setServiceDelTracker(prevState => [...prevState, index]);

    // debugging purpose only 
    console.log("this is dockerfiles: ", dockerfiles);

    
    // save compose to local
    const saveComposeToLocal = (parentFolder, childFolderName, fileName, content) => {
        const worker = new Worker(new URL('../utils/saveDockerComposeDockerfileWorker.js', import.meta.url));
        worker.postMessage({parentFolder, childFolderName, fileName, content});
        worker.onmessage = e => {
            if(e.data.success) {
                console.log("compose data save successfully to local");
                // clear atoms after data is saved
                const num = dockerfiles.services.length;
                resetServiceAtoms(num)
                navigate("/builds");
                // show alert
            }else {
                console.error("the error saving compose data to local is: ", e.data.error);
            }
        }
    }

    // service names are not duplicates
    const saveCompose = () => {
        nameIsValid && dockerfiles.services.map(service => {
            service.dockerfileDetails && saveComposeToLocal("docker-compose", debouncedName, service.dockerfileDetails.name, service.dockerfileDetails);
        });
    }

    return (
        <div className="font-Satoshi">
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
                {!nameIsValid && <div> invalid name, choose different</div>}
                {/* {"Button to add services"} */}
                <Button label={"Add Service"} onClickFun={() => navigate("/create-service")}/>
            </div>
            <div>
                {/* {"this will come from  local storage "} */}
                {dockerfiles.services.length > 0 && dockerfiles.services.map((service,key) => 
                    service.dockerfileDetails && (<div key={key} className="my-4">
                        <div className="flex items-center">
                            <span className="text-xl font-medium text-gray-500">Service Name : </span>
                            <span className="text-xl font-medium text-gray-500 px-2 mr-4">{service.dockerfileDetails.name}</span>
                            <Button label={"Delete Service"} onClickFun={() => delService(key)}/>
                        </div>
                        <DockerfileCode dockerfile={service.dockerfileDetails}/>
                    </div>)
                    )}
            </div>
            <div>
                <Button label={"Save"} onClickFun={saveCompose}/>
            </div>
        </div>
    )
}