import { memo } from "react";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { selectedPackageManagerAtom } from "../../store/atoms/libAtoms/selectedPackageManagerAtom";


export const PackageManager = memo(({label, isMulti=true}) => {

    //? for testing purpose only...
    console.log("re-rendering PackageManager component");
    //? ...

    const [selectedOption, setSelectedOption] = useRecoilState(selectedPackageManagerAtom);
    const options = [
        {label:"Node Package Manager : npm", value:"npm"},
        {label:"Pip Installs Packages : pip", value:"pip"},
        {label:"Rust Package Manager : cargo", value:"cargo"},
        {label:"Ruby Package Manager : gem", value:"gem"}
    ];

    return <div className="flex justify-evenly gap-2">
         <div className="w-1/4 flex justify-between items-center pl-2 font-medium"><span>{label}</span><span>:</span></div>
         <div className="w-3/4 p-2">
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