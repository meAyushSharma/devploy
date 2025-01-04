import { useRecoilValue } from "recoil";
import { DockerSearchComponent } from "../components/DockerSearchComponent";
import { PackageManager } from "../components/PackageManager";
import { PackageSearchComponent } from "../components/PackageSearchComponent";
import { selectedPackageManagerAtom } from "../store/atoms/selectedPackageManagerAtom";

export const CreateProject = () => {
    const packageManagers = useRecoilValue(selectedPackageManagerAtom);
    const arr = packageManagers.map(pm => ({lable: pm.label, value: pm.value}));
    console.log("this is arr: ", arr);
    return <div>
        <div className="text-xl font-medium text-gray-500 mt-4">Software and tools :</div>
        <DockerSearchComponent label={"Operating System "} isMulti={false}/>
        <DockerSearchComponent label={"Runtime(s) "} isMulti={true}/>
        <DockerSearchComponent label={"Database(s) "} isMulti={true}/>
        <div className="text-xl font-medium text-gray-500 mt-4">Framework and libraries :</div>
        <PackageManager label={"Select Package Managers for above choosen runtimes : "} isMulti={true}/>
        {packageManagers.map(pm => <PackageSearchComponent url={pm.value} label={pm.label} key={Math.random()}/>)}
    </div>
}





// const [osOptions, setOsOptions] = useState([]);
// const [osInputValue, setOsInputValue] = useState("");
// const [osSelectedOption, setOsSelectedOption] = useState(null);
// const [isOsLoading, setIsOsLoading] = useState(false);
// useEffect(() => {
//     const fetchOptions = async () => {
//         if (!osInputValue || osInputValue.trim() === "") {
//             setOsOptions([]);
//             return;
//         }

//         setIsOsLoading(true);
//         try {
//             const response = await axios.get(`http://localhost:3007/api/v1/search?q=${osInputValue}`);
//             const data = response.data;
//             const formattedOptions = data.results.map((item) => ({
//                 label: `${item.repo_name} : ${item.short_description}`,
//                 value: item.repo_name,
//             }));

//             setOsOptions(formattedOptions);
//         } catch (error) {
//             console.error("Error fetching options:", error);
//             setOsOptions([]);
//         } finally {
//             setIsOsLoading(false);
//         }
//     };
//     const debounceTimeout = setTimeout(fetchOptions, 500);
//     return () => clearTimeout(debounceTimeout);
// }, [osInputValue]);

// return <div>
//     {/* ---- */}

//     <Select
//         options={osOptions}
//         onInputChange={(newValue) => setOsInputValue(newValue)}
//         onChange={setOsSelectedOption}
//         placeholder="Start typing to search..."
//         isLoading={isOsLoading}
//         isClearable={true}
//         noOptionsMessage={() =>
//                 isOsLoading ? "Loading..." : "No options found"
//             }
//             />
// </div>











// const [inputOs, setInputOs] = useState(null);
// const debouncedValue = useDebounce(inputOs);
// const { data, isLoading, error } = useAxios(debouncedValue && debouncedValue.trim() !== "" ? `http://localhost:3007/api/v1/search?q=${debouncedValue}` : null);

// {/* <div className="">Operating system: <input type="text" onChange={e => setInputOs(e.target.value)} list="osOptions" className="w-inherit"/></div>
// <datalist id="osOptions" className="text-white">
// {data ? data.results.map(res => <option key={res.repo_name} value={res.repo_name + ":" + res.short_description}/>): null}
// </datalist> */}