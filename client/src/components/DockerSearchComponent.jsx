import { memo, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import Select from "react-select";

import { useDockerFetch } from "../hooks/useDockerFetch";

import {selectedDatabaseAtom} from "../store/atoms/softwareAtoms/selectedDatabaseAtom";
import {selectedOsAtom} from "../store/atoms/softwareAtoms/selectedOsAtom";
import {selectedRuntimeAtom} from "../store/atoms/softwareAtoms/selectedRuntimeAtom";


export const DockerSearchComponent = memo(({ label }) => {
  const [inputValue, setInputValue] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const setOs = useSetRecoilState(selectedOsAtom);
  const setRuntime = useSetRecoilState(selectedRuntimeAtom);
  const setDatabase = useSetRecoilState(selectedDatabaseAtom);

  const { options, isLoading } = useDockerFetch(inputValue ? `http://localhost:3007/api/v1/search?q=${inputValue}&requestFor=docker` : null);
  
  useEffect(() => {
        if(label === "Runtime(s)") setRuntime(selectedOption)
        if(label === "Database(s)") setDatabase(selectedOption)
        if(label === "Operating System") setOs(selectedOption)
  }, [selectedOption, label, setOs, setRuntime, setDatabase])

  return (
    <div className="flex justify-evenly gap-2">
      <div className="w-1/4 flex justify-between items-center pl-2 font-medium"><span>{label}</span><span>:</span></div>
      <div className="w-3/4 p-2">
      <Select
        options={options}
        isMulti={true}
        onInputChange={(newValue) => setInputValue(newValue)}
        onChange={(selected) => {
          setSelectedOption(selected || ([]));
        }}
        placeholder={`Start typing to search ${label}...`}
        isLoading={isLoading}
        isClearable
        noOptionsMessage={() => (isLoading ? "Loading..." : "No options found")}
      />
      </div>
    </div>
  );
});
