import { useRecoilValue } from "recoil";
import { memo } from "react";
import { DockerSearchComponent } from "../components/DockerSearchComponent";
import { PackageManager } from "../components/PackageManager";
import { PackageSearchComponent } from "../components/PackageSearchComponent";
import { selectedPackageManagerAtom } from "../store/atoms/libAtoms/selectedPackageManagerAtom";
import { TestComponent } from "../components/testComponent";

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
        <DockerSearchComponent label={"Operating System"}/>
        <DockerSearchComponent label={"Runtime(s)"}/>
        <DockerSearchComponent label={"Database(s)"}/>
        <div className="text-xl font-medium text-gray-500 mt-4">Framework and libraries :</div>
        <PackageManager label={"Select Package Managers for above choosen runtimes : "} isMulti={true}/>
        {packageManagers.map(pm => <PackageSearchComponent requestFor={pm.value} label={pm.label} key={pm.label.split(":")[1]}/>)}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <TestComponent/>
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