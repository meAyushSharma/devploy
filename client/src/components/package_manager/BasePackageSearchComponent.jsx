import { memo, useEffect, useState } from "react";
import { useAxios } from "../../hooks/useAxios";
import Select from "react-select";

export const BasePackageSearchComponent = memo(({ label, requestFor, transformData, setGlobalState }) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { data, isLoading } = useAxios(inputValue?`http://localhost:3007/api/v1/search?q=${inputValue}&requestFor=${requestFor}`:null);
    useEffect(() => {
        if (data) {
            const transformedOptions = transformData(data);
            setOptions(transformedOptions);
        }
    }, [data, transformData]);

    useEffect(() => {
        // console.log("global state updated: ", selectedOptions);
        setGlobalState(selectedOptions);
    }, [selectedOptions, setGlobalState]);

    return (
        <div className="flex justify-evenly gap-2">
             <div className="w-1/4 flex justify-between items-center pl-2 font-medium"><span>{label}</span><span>:</span></div>
             <div className="w-3/4 p-2">
                <Select
                    options={options}
                    isMulti={true}
                    onInputChange={(newValue) => setInputValue(newValue)}
                    onChange={(selected) => setSelectedOptions(selected)}
                    placeholder={`Start typing to search ${label}...`}
                    isLoading={isLoading}
                    isClearable
                />
            </div>
        </div>
    );
})
