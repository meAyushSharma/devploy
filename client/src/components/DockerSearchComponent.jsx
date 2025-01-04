import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import Select from "react-select";

import { useFetchOptions } from "../hooks/useFetchOptions";

import {selectedDatabaseAtom} from "../store/atoms/selectedDatabaseAtom";
import {selectedOsAtom} from "../store/atoms/selectedOsAtom";
import {selectedRuntimeAtom} from "../store/atoms/selectedRuntimeAtom";



export const DockerSearchComponent = ({ label, isMulti }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(isMulti ? [] : null);

  const setOs = useSetRecoilState(selectedOsAtom);
  const setRuntime = useSetRecoilState(selectedRuntimeAtom);
  const setDatabase = useSetRecoilState(selectedDatabaseAtom);

  const { options, isLoading } = useFetchOptions(inputValue ? `http://localhost:3007/api/v1/search?q=${inputValue}` : null);
  
  useEffect(() => {
    if(isMulti){
        if(label === "Operating System ") setOs(selectedOption) // just in case for future
        if(label === "Runtime(s) ") setRuntime(selectedOption)
        if(label === "Database(s) ") setDatabase(selectedOption)
    }else {
        if(label === "Operating System ") setOs(selectedOption ? selectedOption : null)
        if(label === "Runtime(s) ") setRuntime(selectedOption ? selectedOption : []) // jic
        if(label === "Database(s) ") setDatabase(selectedOption ? selectedOption : []) //jic
    }
  }, [selectedOption, isMulti, label, setOs, setRuntime, setDatabase])

  return (
    <div>
      <label>{label} : </label>
      <Select
        options={options}
        isMulti={isMulti}
        onInputChange={(newValue) => setInputValue(newValue)}
        onChange={(selected) => {
          setSelectedOption(selected || (isMulti ? [] : null));
        }}
        placeholder={`Start typing to search ${label}...`}
        isLoading={isLoading}
        isClearable
        noOptionsMessage={() => (isLoading ? "Loading..." : "No options found")}
      />
      {selectedOption && (
        <p>
          Selected:{" "}
          <strong>
            {isMulti
              ? selectedOption.map((opt) => opt.label).join(", ")
              : selectedOption.label}
          </strong>
        </p>
      )}
    </div>
  );
};
