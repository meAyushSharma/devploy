import { memo, useEffect, useState } from "react";
import Select from "react-select";
import { useFetchRegistry } from "../../hooks/useFetchRegistry";

const BasePackageSearchComponent = memo(({ label, requestFor, transformData, setGlobalState }) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { data, isLoading, error } = useFetchRegistry({ inputValue: inputValue ? inputValue : null, requestFor });
    useEffect(() => {
        if (data) {
            const transformedOptions = transformData(data);
            setOptions(transformedOptions);
        }
    }, [data, transformData]);

    useEffect(() => {
        setGlobalState(selectedOptions);
    }, [selectedOptions, setGlobalState]);

    useEffect(() => {
        if(error) {
            alert(`The error is: ${error.message}`);
        }
    }, [error]);

    return (
        <div className="grid md:grid-cols-[1fr_3fr]">
             <div className="flex items-center text-lg font-medium text-gray-800"><span>${label}</span><span>:</span></div>
             <div className="m-1">
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

export default BasePackageSearchComponent;
