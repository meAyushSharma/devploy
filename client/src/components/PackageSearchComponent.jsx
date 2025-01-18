
//! Depreciated ::


import React, { useEffect, useState } from "react";
import Select from "react-select";

import { useAxios } from "../hooks/useAxios";
import { useSetRecoilState } from "recoil";

import npmLibsAtom from "../store/atoms/libAtoms/npmLibsAtom";
import pipLibsAtom from "../store/atoms/libAtoms/pipLibsAtom";
import cargoLibsAtom from "../store/atoms/libAtoms/cargoLibsAtom";
import gemLibsAtom from "../store/atoms/libAtoms/gemLibsAtom";

const PackageSearchComponent = React.memo(({requestFor, label}) => {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState(null);
    const [actualUrl, setActualUrl] = useState(null);
    useEffect(() => {
        if(inputValue){
            const updatedUrl = `http://localhost:3007/api/v1/search?q=${inputValue}&requestFor=${requestFor}`;
            setActualUrl(updatedUrl);
        }
    }, [inputValue, requestFor])
    const {data, isLoading, error} = useAxios(actualUrl);
    // now define how data from query will be handeled (setting options for Select)...
    useEffect(() => {
        const signature = requestFor;
        if (signature === "npm" && data){
            const options = data.objects.map(ele => ({
                label: `Name: ${ele.package.name} , ${ele.package.description} || version : ${ele.package.version}`,
                value: ele.package.name
            }))
            console.log("npm option added")
            setOptions(options);
        }else if (signature === "pip" && data){
            if(data.message === "Not Found"){
                setOptions([]);
            }else if(data.info){
                const option = [{ label: `Name : ${data.info.name} || version : ${data.info.version} || ${data.info.summary}`, value: data.info.name }]
                console.log("pip option added")
                setOptions(option);
            }
        }else if (signature === "cargo" && data) {
            const options = data.crates.map(ele => ({
                label:`Name : ${ele.id} || ${ele.description}`,
                value: ele.id
            }))
            console.log("cargo option added")
            setOptions(options);
        }else if (signature === "gem" && data) {
            const options = data.map(ele => ({
                label:`Name : ${ele.name} || ${ele.version} || Info : ${ele.info}`,
                value: ele.name
            }));
            console.log("gem option added")
            setOptions(options);
        }
    }, [requestFor, data, setOptions]);

    // now define how choosen option(s) will be handeled (setting global variables)
    const setNpmLibs = useSetRecoilState(npmLibsAtom);
    const setPipLibs = useSetRecoilState(pipLibsAtom);
    const setCargoLibs = useSetRecoilState(cargoLibsAtom);
    const setGemLibs = useSetRecoilState(gemLibsAtom);

    useEffect(() => {
        switch(requestFor){
            case "npm" :
                console.log("npm added to global", selectedOptions);
                setNpmLibs(selectedOptions);
                break;
            case "pip" :
                setPipLibs(selectedOptions);
                break;
            case "cargo" :
                setCargoLibs(selectedOptions);
                break;
            case "gem" :
                setGemLibs(selectedOptions);
                break;
            default :
                console.log("Wrong 'requestFor' in 'PackageSearchComponent' in setting 'global state'");
        }
    }, [requestFor, setNpmLibs, setPipLibs, setCargoLibs, setGemLibs, selectedOptions]);

    return <div>
        <label>{label} :</label>
        <Select
            options={options}
            isMulti={true}
            onInputChange={(newValue) => setInputValue(newValue)}
            onChange={(selected) => {
              setSelectedOptions(selected);
            }}
            placeholder={`Start typing to search ${label}...`}
            isLoading={isLoading}
            isClearable
            noOptionsMessage={() => (isLoading ? "Loading..." : "No options found")}
        />
    </div>
})

export default PackageSearchComponent;