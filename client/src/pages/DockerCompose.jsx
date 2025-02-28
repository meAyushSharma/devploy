import { lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import Cookies from "js-cookie";

import { FaSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5"
import { MdAddBox } from "react-icons/md";
import { FiLoader } from "react-icons/fi";

import Button from "../components/common/Button";
const DockerfileCode = lazy(() => import("../components/DockerfileCode"))

import { useAlert } from "../hooks/useAlert";
import { useDebounce } from "../hooks/useDebounce";
import { useSaveCompose } from "../hooks/useSaveCompose";
import { useResetAllAtoms } from "../hooks/useResetAllAtoms";
import { useWorkerValidName } from "../hooks/useWorkerValidName";

import { userModeSelector } from "../store/selectors/userModeSelector";
import { dockerfileSelector } from "../store/selectors/dockerfileSelector";
import { serviceDelTrackerAtom } from "../store/atoms/serviceDelTrackerAtom";

import { saveToLocal } from "../helper/saveToLocal";
import { generateCompose } from "../helper/generateCompose";
import { saveToDB } from "../helper/saveToDB";



const DockerCompose = () => {
    /* restriction */
    const navigate = useNavigate();
    const isUserLoggedIn = useRecoilValue(userModeSelector);
    const isGuestLoggedIn = Cookies.get("localAuthToken") === "true"; // local
    useEffect(() => {
        if(!(isGuestLoggedIn || isUserLoggedIn)) navigate("/signup");
    }, [isGuestLoggedIn, navigate, isUserLoggedIn]);

    // obviously type=service
    const {showAlert} = useAlert();
    //* handle project name : project name of docker compose is not global variable, so handle while keeping it in mind
    const [projName, setProjName] = useState("my-project");
    const debouncedName = useDebounce(projName, 1000);
    const nameIsValid = useWorkerValidName({workerPath:'../worker/dockerComposeFolderDuplicacy.js', debouncedName, type:"service"});  // check folderName duplicacy
    const [isTouched, setIsTouched] = useState(false);
    const handleBlur = () => setIsTouched(true);
    
    const dockerfiles = useRecoilValue(dockerfileSelector); // dockerfiles:{environment:JSON, services:[{ dockerfileDetails:JSON, name:'useless' }]}
    const composeFile = generateCompose(dockerfiles);
    // handle service deletion
    const [serviceDelTracker, setServiceDelTracker] = useRecoilState(serviceDelTrackerAtom);
    const delService = (index) => setServiceDelTracker(prevState => [...prevState, index]);
    const isUserRegistered = useRecoilValue(userModeSelector);

    // debugging purpose only 
    // console.log("this is dockerfiles: ", dockerfiles);

    // reset all atoms upon save
    const n = dockerfiles.services.length;
    const resetAllAtoms = useResetAllAtoms(n);

    const saveToggle = (n-serviceDelTracker.length);

    const { saveComposeToDB, isSaving, composeSaved, composeError } = useSaveCompose({
        saveToDB,
        saveToLocal,
        dockerfiles,
        composeFile,
        debouncedName,
        nameIsValid,
        resetAllAtoms,
        isUserRegistered
    });
    
    useEffect(() => {
        composeSaved && showAlert("Saved compose files successfully (づ￣ 3￣)づ", "info");
    }, [composeSaved]);

    useEffect(() => {
        composeError && showAlert("Error saving compose files (┬┬﹏┬┬)", "info");
    }, [composeError]);

    return ((isGuestLoggedIn || isUserLoggedIn) && 
        <div className="font-Satoshi m-5 bg-soft-white">
            <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-700 my-4">Project name : </span>
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
            <div className="max-w-[15%] ml-auto">
                <div className="w-fit text-lg">
                    <Button>
                        <MdAddBox className="text-2xl"/>
                        <button onClick={() => navigate("/create-service")}>Add Service</button>
                    </Button>
                </div>
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
                    {dockerfiles.services.length == 0 && (
                        <div className="w-[80vw] h-[60vh] bg-[url('./assets/docker-compose-empty.png')] bg-center bg-contain bg-no-repeat rounded-lg m-auto my-6">
                        </div>
                    )}
            </div>
            {saveToggle>0 && ( 
            <div className="max-w-[15%] ml-auto">
                <div className="w-fit ml-auto text-xl mr-[3vw]">
                    <Button>
                    <button onClick={saveComposeToDB} 
                        className="flex items-center gap-2 px-1" 
                        style={{cursor:`${isSaving ? "not-allowed" : "pointer"}`, pointerEvents:`${isSaving ? "none" : "auto"}`}}>{!isSaving ? <FaSave/> : <FiLoader className="animate-spin"/>}Save File</button>
                    </Button>
                </div>
            </div>
            )}
           
        </div>
    )
}

export default DockerCompose;