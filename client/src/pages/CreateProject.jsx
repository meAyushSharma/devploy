import { useRecoilValue } from "recoil";
import { memo } from "react";

import { PackageManager } from "../components/package_manager/PackageManager";
import { selectedPackageManagerAtom } from "../store/atoms/libAtoms/selectedPackageManagerAtom";
import { TestComponent } from "../components/testComponent";

import { DockerSearchComponent } from "../components/DockerSearchComponent";
import { NpmSearchComponent } from "../components/package_manager/NpmSearchComponent";
import { CargoSearchComponent } from "../components/package_manager/CargoSearchComponent";
import { PipSearchComponent } from "../components/package_manager/PipSearchComponent";
import { GemSearchComponent } from "../components/package_manager/GemSearchComponent";
import { Environments } from "../components/environment/Environments";
import { Configurations } from "../components/Configurations";
// import { PackageSearchComponent } from "../components/PackageSearchComponent"; //! depreciated



// * memo not needed
export const CreateProject = memo(() => {
    // TODO : just fancy wrapper for "selectedPackageManagerAtom", nothing else
    // const packageManagers = useRecoilValue(transformedPackageManagerSelector);
    //?for debugging purposes only ...
    console.log("am i re-rendering?");
    //? ...

    const packageManagers = useRecoilValue(selectedPackageManagerAtom);
    return <div>
        <div className="text-xl font-medium text-gray-500 mt-4">Software and tools :</div>
        <div className="">
            <DockerSearchComponent label={"Operating System"}/>
        </div>
        <DockerSearchComponent label={"Runtime(s)"}/>
        <DockerSearchComponent label={"Database(s)"}/>
        <div className="text-xl font-medium text-gray-500 mt-4">Framework and libraries :</div>
        <div>
            <PackageManager label={"Package Managers"} isMulti={true}/>
        </div>

        {/* //? depreciated :: */}
        {/* {packageManagers.map(pm => <PackageSearchComponent requestFor={pm.value} label={pm.label} key={pm.label.split(":")[1]}/>)} */}

        {/* //todo : updated :: more modular */ }
        {packageManagers.map(pm => {
            const pmValue = pm.value;
            switch(pmValue){
                case "npm":
                    return <NpmSearchComponent key={pmValue}/>
                case "pip":
                    return <PipSearchComponent key={pmValue}/>
                case "cargo":
                    return <CargoSearchComponent key={pmValue}/>
                case "gem":
                    return <GemSearchComponent key={pmValue}/>
                default :
                    return <div key={pmValue}>Wrong package manager chosen</div>;             
            }
        })}
        <Configurations/>
        <Environments/>
        <br />
        <br />
        <br />
    </div>
})






// classic method ::

// const [inputOs, setInputOs] = useState(null);
// const debouncedValue = useDebounce(inputOs);
// const { data, isLoading, error } = useAxios(debouncedValue && debouncedValue.trim() !== "" ? `http://localhost:3007/api/v1/search?q=${debouncedValue}` : null);

// {/* <div className="">Operating system: <input type="text" onChange={e => setInputOs(e.target.value)} list="osOptions" className="w-inherit"/></div>
// <datalist id="osOptions" className="text-white">
// {data ? data.results.map(res => <option key={res.repo_name} value={res.repo_name + ":" + res.short_description}/>): null}
// </datalist> */}