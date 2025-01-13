import { useRecoilState, useRecoilValue } from "recoil";
import { memo, useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

import { PackageManager } from "../components/package_manager/PackageManager";
import { selectedPackageManagerAtom } from "../store/atoms/libAtoms/selectedPackageManagerAtom";

import { DockerSearchComponent } from "../components/DockerSearchComponent";
import { NpmSearchComponent } from "../components/package_manager/NpmSearchComponent";
import { CargoSearchComponent } from "../components/package_manager/CargoSearchComponent";
import { PipSearchComponent } from "../components/package_manager/PipSearchComponent";
import { GemSearchComponent } from "../components/package_manager/GemSearchComponent";
import { Environments } from "../components/environment/Environments";
import { Configurations } from "../components/Configurations";
import { NetworkConfig } from "../components/netword_config/NetworkConfig";
import { serviceCountAtom } from "../store/atoms/serviceCountAtom";
import { Button } from "../components/common/Button";
import { CreateDockerfile } from "../components/CreateDockerfile";
import { projectNameAtom } from "../store/atoms/projectNameAtom";

import { envNameDuplicacy } from "../utils/envNameDuplicacy";
import { createDirectory } from "../utils/createDirectory";
import { dockerComposeFolderDuplicacy } from "../utils/dockerComposeFolderDuplicacy";



export const CreateProject = memo(({type}) => {
    //?for debugging purposes only ...
    console.log("am i re-rendering?");


    // create directory structure
    useEffect(() => {
        const dirCreate = async () => await createDirectory();
        dirCreate();
    }, [createDirectory]);

    // check whether : service or env
    const [serviceCount, setServiceCount] = useRecoilState(serviceCountAtom);
    const env = type === "env";
    const service = type === "service";
    const whatType = env ? "env" : service ? `service${serviceCount+1}` : -1;

    // project name
    const idForName = whatType;
    const [projName, setProjName] = useRecoilState(projectNameAtom(idForName));
    const [nameIsValid, setNameIsValid] = useState(null);
    const [isTouched, setIsTouched] = useState(false);
    const handleBlur = () => setIsTouched(true);

    // check environment (folder) dockerfiles duplicates
    useEffect(() => {
        if(env) {
            const fetchNames = async () => { 
                const envNames = await envNameDuplicacy();
                console.log("this is envNames: ", envNames);
                if(envNames.includes(projName)) setNameIsValid(false);
                else setNameIsValid(true);
            }
            fetchNames();
        }else {
            const fetchNames = async () => {
                const dcFolderNames = await dockerComposeFolderDuplicacy();
                console.log("this is dcFolderNames: ", dcFolderNames);
                if(dcFolderNames.includes(projName)) setNameIsValid(false);
                else setNameIsValid(true);
            }
            fetchNames();
        }
    }, [env, projName, envNameDuplicacy, dockerComposeFolderDuplicacy, setNameIsValid])

    // review 
    const [review, setReview] = useState(false);
    // pm for selected managers
    const packageManagers = useRecoilValue(env ? selectedPackageManagerAtom(type) : selectedPackageManagerAtom(`service${serviceCount+1}`));

    return <div className="font-Satoshi">
        <div className="flex items-center">
            <span>{env?"Environment":`Service${serviceCount+1}`} name : </span>
            <input 
            type="text"
            onBlur={handleBlur}
            onChange={e => setProjName(e.target.value.trim())}
            value={projName}
            className={`border rounded text-lg font-medium px-2 text-center mx-2 ${projName ? 'border-blue-500':'border-rose-500 mx-2'} enabled:hover:border-gray-400`}
            />
            {!projName && isTouched && (
                <div className="flex gap-1 items-center">
                    <IoInformationCircleOutline className="text-rose-500"/>
                    <span className="text-rose-500 text-sm">This field is required</span>
                </div>
            )}
            {!nameIsValid && <div> invalid name, choose different</div>}
        </div>
        <div className="text-xl font-medium text-gray-500 mt-4">Software and tools :</div>
        <div className="">
            <DockerSearchComponent label={"Operating System"} type={whatType}/>
        </div>
        <DockerSearchComponent label={"Runtime(s)"} type={whatType}/>
        <DockerSearchComponent label={"Database(s)"} type={whatType}/>
        <div className="text-xl font-medium text-gray-500 mt-4">Framework and libraries :</div>
        <div>
            <PackageManager label={"Package Managers"} isMulti={true} type={whatType}/>
        </div>

        {/* //? depreciated :: */}
        {/* {packageManagers.map(pm => <PackageSearchComponent requestFor={pm.value} label={pm.label} key={pm.label.split(":")[1]}/>)} */}

        {/* //todo : updated :: more modular */ }
        {packageManagers.map(pm => {
            const pmValue = pm.value;
            switch(pmValue){
                case "npm":
                    return <NpmSearchComponent key={pmValue} type={whatType}/>
                case "pip":
                    return <PipSearchComponent key={pmValue} type={whatType}/>
                case "cargo":
                    return <CargoSearchComponent key={pmValue} type={whatType}/>
                case "gem":
                    return <GemSearchComponent key={pmValue} type={whatType}/>
                default :
                    return <div key={pmValue}>Wrong package manager chosen</div>;             
            }
        })}
        <Configurations type={whatType}/>
        <Environments type={whatType}/>
        <NetworkConfig type={whatType}/>
        <div className="w-fit bg-green-500 text-white rounded-md">
            <Button label={"Review"} onClickFun={e => setReview(state => !state)}/>
        </div>
        <br />
        {review && projName && nameIsValid && <CreateDockerfile type={whatType}/>}
    </div>
});