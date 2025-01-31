import { useRecoilState, useRecoilValue } from "recoil";
import { lazy, memo, useEffect, useState } from "react";

import { IoInformationCircleOutline } from "react-icons/io5";
import { MdReviews } from "react-icons/md";

import { selectedPackageManagerAtom } from "../store/atoms/libAtoms/selectedPackageManagerAtom";
import { serviceCountAtom } from "../store/atoms/serviceCountAtom";
import { projectNameAtom } from "../store/atoms/projectNameAtom";

const DockerSearchComponent = lazy(() => import("../components/DockerSearchComponent"));
const PackageManager = lazy(() => import("../components/package_manager/PackageManager"));
const Environments = lazy(() => import("../components/environment/Environments"));
const Configurations = lazy(() => import("../components/Configurations"));
const NetworkConfig = lazy(() => import("../components/netword_config/NetworkConfig"));
const Button = lazy(() => import("../components/common/Button"));
const CreateDockerfile = lazy(() => import("../components/CreateDockerfile"));
const RenderPackageManager = lazy(() => import("../components/package_manager/RenderPackageManager"));


// import PackageManager from "../components/package_manager/PackageManager";
// import Environments from "../components/environment/Environments";
// import Configurations from "../components/Configurations";
// import NetworkConfig from "../components/netword_config/NetworkConfig";
// import Button from "../components/common/Button";
// import CreateDockerfile from "../components/CreateDockerfile";
// import RenderPackageManager from "../components/package_manager/RenderPackageManager";

import { getServiceNames } from "../store/selectors/getServiceNames";
import { useDebounce } from "../hooks/useDebounce";
import { useWorkerValidName } from "../hooks/useWorkerValidName";



const CreateProject = memo(({type}) => {
    //?for debugging purposes only ...
    console.log("am i re-rendering?");


    // check whether : service or env
    const [serviceCount, setServiceCount] = useRecoilState(serviceCountAtom);
    const env = type === "env";
    const service = type === "service";
    const whatType = env ? "env" : service ? `service${serviceCount+1}` : -1;

    // project name
    const [projName, setProjName] = useRecoilState(projectNameAtom(whatType));
    const debouncedName = useDebounce(projName, 1000);
    const [nameIsValid, setNameIsValid] = useState(null);

    // check environment (folder) dockerfiles duplicates
    const envNameisValid = useWorkerValidName({workerPath:'../worker/envNameDuplicacy.js', debouncedName});

     // handles empty input
    const [isTouched, setIsTouched] = useState(false);
    const handleBlur = () => setIsTouched(true);

    // getServiceNames(get names only) => have undeleted ones only.
    const services = useRecoilValue(getServiceNames);
    useEffect(() => {
        service && debouncedName && (services.includes(debouncedName) ? setNameIsValid(false) : setNameIsValid(true));
    }, [setNameIsValid, service, services, debouncedName]);

    
    // review 
    const [review, setReview] = useState(false);

    // pm for selected managers
    const packageManagers = useRecoilValue(selectedPackageManagerAtom(whatType));

    return (
    <div className="font-Satoshi m-5 bg-soft-white">
        <div className="flex items-center">
            <span className="text-3xl font-semibold text-gray-700">{env?"Environment":`Service${serviceCount+1}`} name : </span>
            <input 
            type="text"
            onBlur={handleBlur}
            onChange={e => setProjName(e.target.value.trim())}
            value={projName}
            className={`border rounded text-lg font-medium px-2 text-center text-gray-700 mx-2 ${projName ? 'border-violet-500':'border-rose-500 mx-2'} enabled:hover:border-gray-400`}
            />
            {!projName && isTouched && (
                <div className="flex gap-1 items-center">
                    <IoInformationCircleOutline className="text-rose-500"/>
                    <span className="text-rose-500 text-sm">This field is required</span>
                </div>
            )}
            {env && projName && !envNameisValid && (
                <div className="flex gap-1 items-center">
                    <IoInformationCircleOutline className="text-rose-500"/>
                    <span className="text-rose-500 text-sm">Name already exists</span>
                </div>
            )}
            {service && projName && !nameIsValid && (
                <div className="flex gap-1 items-center">
                    <IoInformationCircleOutline className="text-rose-500"/>
                <span className="text-rose-500 text-sm">Name already exists</span>
            </div>
            )}
        </div>


        <div className="text-2xl font-semibold text-gray-700/80 mt-4">Software and tools :</div>
        <DockerSearchComponent label={"Operating System"} type={whatType}/>
        <DockerSearchComponent label={"Runtime(s)"} type={whatType}/>
        <DockerSearchComponent label={"Database(s)"} type={whatType}/>


        <div className="text-2xl font-semibold text-gray-700/80 mt-4">Framework and libraries :</div>
        <PackageManager label={"Package Managers"} isMulti={true} type={whatType}/>
        {packageManagers.map((pm, key) => <RenderPackageManager pmValue={pm.value} whatType={whatType} key={key}/>)}


        <div className="text-2xl font-semibold text-gray-700/80 mt-4 mb-2">Choose Configurations :</div>
        <Configurations type={whatType}/>
        <Environments type={whatType}/>
        <NetworkConfig type={whatType}/>
        <div className="w-full text-xl">
            <div className="max-w-[10%] ml-auto text-xl mr-[3vw]">
                <Button>
                    <MdReviews/>
                    <button onClick={e => setReview(state => !state)}>Review</button>
                </Button>
            </div>
        </div>
        <br />
        {review && debouncedName && ((env && envNameisValid) || (service && nameIsValid)) && <CreateDockerfile type={whatType}/>}
    </div>
    )
})

export default CreateProject;