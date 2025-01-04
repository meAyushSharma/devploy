import { useEffect, useState } from "react";
import Select from "react-select";
import { useSetRecoilState } from "recoil";

import { selectedPackageManagerAtom } from "../store/atoms/selectedPackageManagerAtom";

export const PackageManager = ({isMulti, label}) => {
    const [inputValue, setInputValue] = useState(null);
    const [selectedOption, setSelectedOption] = useState([]);
    const setSelectedPackageManager = useSetRecoilState(selectedPackageManagerAtom);
    useEffect(() => {
        setSelectedPackageManager(selectedOption);
    }, [isMulti, selectedOption, setSelectedPackageManager])
    const options = [
        {label:"Node Package Manager : npm", value:"npm|https://registry.npmjs.org/-/v1/search?text=$"},
        {label:"Pip Installs Packages : pip", value:"pip|https://pypi.org/pypi/$/json"},
        {label:"Rust Package Manager : cargo", value:"cargo|https://crates.io/api/v1/crates?q=$"},
        {label:"Ruby Package Manager : gem", value:"gem|https://rubygems.org/api/v1/search.json?query=$"},
        // {label:"Java Development Kit : sdk", value:"sdk"},
        // {label:"Javascript Package Manager : yarn", value:"yarn"}
    ];

    return <div>
        <label>{label} :</label>
        <Select
            options={options}
            isMulti={isMulti}
            onInputChange={(newValue) => setInputValue(newValue)}
            onChange={(selected) => {
              setSelectedOption(selected || (isMulti ? [] : null));
            }}
            placeholder={`Start typing to search ${label}...`}
            isLoading={true}
            isClearable
            noOptionsMessage={() => (isLoading ? "Loading..." : "No options found")}
      />
      {selectedOption && (
        selectedOption.map(ele => ele.label).join(", ")
      )}
    </div>
}