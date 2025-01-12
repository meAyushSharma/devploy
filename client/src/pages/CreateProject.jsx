import { useRecoilState, useRecoilValue } from "recoil";
import { memo, useEffect, useState } from "react";

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
// import { PackageSearchComponent } from "../components/PackageSearchComponent"; //! depreciated



// * memo not needed
export const CreateProject = memo(({type}) => {
    // TODO : just fancy wrapper for "selectedPackageManagerAtom", nothing else
    // const packageManagers = useRecoilValue(transformedPackageManagerSelector);
    //?for debugging purposes only ...
    console.log("am i re-rendering?");
    //? ...
    const [projName, setProjName] = useState("");
    const [serviceCount, setServiceCount] = useRecoilState(serviceCountAtom);
    const env = type === "env";
    const service = type === "service";
    const saveProject = () => service && setServiceCount(count => count+1)
    const [review, setReview] = useState(false);
    const packageManagers = useRecoilValue(env ? selectedPackageManagerAtom(type) : selectedPackageManagerAtom(`service${serviceCount+1}`));
    return <div>
        <div>
            <span>{env?"Environment":`Service${serviceCount+1}`} name : </span> <input type="text" onChange={e => setProjName(e.target.value)} value={projName} className="border-2 rounded"/>
        </div>
        <div className="text-xl font-medium text-gray-500 mt-4">Software and tools :</div>
        <div className="">
            <DockerSearchComponent label={"Operating System"} type={env?"env":`service${serviceCount+1}`}/>
        </div>
        <DockerSearchComponent label={"Runtime(s)"} type={env?"env":`service${serviceCount+1}`}/>
        <DockerSearchComponent label={"Database(s)"} type={env?"env":`service${serviceCount+1}`}/>
        <div className="text-xl font-medium text-gray-500 mt-4">Framework and libraries :</div>
        <div>
            <PackageManager label={"Package Managers"} isMulti={true} type={env?"env":`service${serviceCount+1}`}/>
        </div>

        {/* //? depreciated :: */}
        {/* {packageManagers.map(pm => <PackageSearchComponent requestFor={pm.value} label={pm.label} key={pm.label.split(":")[1]}/>)} */}

        {/* //todo : updated :: more modular */ }
        {packageManagers.map(pm => {
            const pmValue = pm.value;
            switch(pmValue){
                case "npm":
                    return <NpmSearchComponent key={pmValue} type={env?"env":`service${serviceCount+1}`}/>
                case "pip":
                    return <PipSearchComponent key={pmValue} type={env?"env":`service${serviceCount+1}`}/>
                case "cargo":
                    return <CargoSearchComponent key={pmValue} type={env?"env":`service${serviceCount+1}`}/>
                case "gem":
                    return <GemSearchComponent key={pmValue} type={env?"env":`service${serviceCount+1}`}/>
                default :
                    return <div key={pmValue}>Wrong package manager chosen</div>;             
            }
        })}
        <Configurations type={env?"env":`service${serviceCount+1}`}/>
        <Environments type={env?"env":`service${serviceCount+1}`}/>
        <NetworkConfig type={env?"env":`service${serviceCount+1}`}/>
        <Button label={"Review"} onClickFun={e => setReview(true)}/>
        <br />
        <br />
        <br />
        {(review && projName) && <CreateDockerfile type={env?"env":`service${serviceCount+1}`}/>}
    </div>
});