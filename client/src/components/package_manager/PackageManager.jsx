import { memo } from "react";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { selectedPackageManagerAtom } from "../../store/atoms/libAtoms/selectedPackageManagerAtom";


const PackageManager = memo(({label, isMulti=true, type}) => {

    //? for testing purpose only...
    console.log("re-rendering PackageManager component");
    //? ...

    const [selectedOption, setSelectedOption] = useRecoilState(selectedPackageManagerAtom(type));
    const options = [
        {label:"Node Package Manager : npm", value:"npm"},
        {label:"Pip Installs Packages : pip", value:"pip"},
        {label:"Rust Package Manager : cargo", value:"cargo"},
        {label:"Ruby Package Manager : gem", value:"gem"}
    ];

    return <div className="grid md:grid-cols-[1fr_3fr] mb-2">
         <div className="flex items-center md:text-lg sm:text-base text-sm font-medium text-gray-800"><span>{label}</span><span>:</span></div>
         <div className="m-1">
            <Select
                options={options}
                isMulti={isMulti}
                onChange={(selected) => {
                  setSelectedOption(selected || (isMulti ? [] : null));
                }}
                placeholder={`Start typing to search ${label}...`}
                isClearable
            />
          </div>
    </div>
})

export default PackageManager;