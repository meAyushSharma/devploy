import { useEffect, useState } from "react";
import Select from "react-select";
import { useAxios } from "../hooks/useAxios";

export const PackageSearchComponent = ({url, label}) => {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState(null);
    const [actualUrl, setActualUrl] = useState(null);
    useEffect(() => {
        if(inputValue){
            const updatedUrl = url.split("|")[1].replace("$", inputValue);
            setActualUrl(updatedUrl);
        }
    }, [inputValue, url])
    const {data, isLoading, error} = useAxios(actualUrl);
    console.log("this is actual url:: ", actualUrl)
    // now define how each data from npm, pip, gem, cargo will be handeled
    useEffect(() => {
        const signature = label.split(":")[1];
        if (signature === " npm" && data){
            const options = data.objects.map(ele => ({
                label: `Name: ${ele.package.name} , ${ele.package.description} || version : ${ele.package.version}`,
                value: ele.package.name
            }))
            setOptions(options);
        }else if (signature === " pip" && data){
            if(data.message === "Not Found"){
                console.log("pip not found!!")
                setOptions([]);
            }else if(data.info){
                console.log("pip founddd!!!");
                const option = [{ label: `version : ${data.info.version} || ${data.info.summary}`, value: data.info.name }]
                setOptions(option);
            }
        }else if (signature === " cargo" && data) {
            const options = data.crates.map(ele => ({
                label:`${ele.description}`,
                value: ele.id
            }))
            setOptions(options);
        }else if (signature === " gem" && data) {
            const options = data.map(ele => ({
                label:`${ele.version} || Info : ${ele.info}`,
                value:ele.name
            }));
            setOptions(options);
        }
    }, [label, data, setOptions])
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
}