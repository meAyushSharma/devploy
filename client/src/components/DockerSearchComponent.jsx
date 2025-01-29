import { memo, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import Select from "react-select";

import { useFetchRegistry } from "../hooks/useFetchRegistry";

import {selectedDatabaseAtom} from "../store/atoms/softwareAtoms/selectedDatabaseAtom";
import {selectedOsAtom} from "../store/atoms/softwareAtoms/selectedOsAtom";
import {selectedRuntimeAtom} from "../store/atoms/softwareAtoms/selectedRuntimeAtom";


const DockerSearchComponent = memo(({ label, type }) => {
  const [inputValue, setInputValue] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const setOs = useSetRecoilState(selectedOsAtom(type));
  const setRuntime = useSetRecoilState(selectedRuntimeAtom(type));
  const setDatabase = useSetRecoilState(selectedDatabaseAtom(type));

  const { data, isLoading, error } = useFetchRegistry({inputValue : inputValue ? inputValue : null , requestFor : "docker"});
  
  useEffect(() => {
        if(label === "Runtime(s)") setRuntime(selectedOption)
        if(label === "Database(s)") setDatabase(selectedOption)
        if(label === "Operating System") setOs(selectedOption)
  }, [selectedOption, label, setOs, setRuntime, setDatabase])

  return (
    <div className="grid md:grid-cols-[1fr_3fr]">
      <div className="flex items-center text-lg font-medium text-gray-800"><span>{label}</span><span>:</span></div>
      <div className="m-1">
      <Select
        options={data}
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

export default DockerSearchComponent;
