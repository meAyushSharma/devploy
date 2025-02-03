import { memo, useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import Select from "react-select";

import { useFetchRegistry } from "../hooks/useFetchRegistry";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

import {selectedDatabaseAtom} from "../store/atoms/softwareAtoms/selectedDatabaseAtom";
import {selectedOsAtom} from "../store/atoms/softwareAtoms/selectedOsAtom";
import {selectedRuntimeAtom} from "../store/atoms/softwareAtoms/selectedRuntimeAtom";
import searchRegistryService from "../utils/searchRegistryService";


const DockerSearchComponent = memo(({ label, type }) => {
  const [inputValue, setInputValue] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const setOs = useSetRecoilState(selectedOsAtom(type));
  const setRuntime = useSetRecoilState(selectedRuntimeAtom(type));
  const setDatabase = useSetRecoilState(selectedDatabaseAtom(type));

  const { data, isLoading, error } = useFetchRegistry({inputValue : inputValue ? inputValue : null , requestFor : "docker"});

  const [inputTags, setInputTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState({});
  const prevSelectedOption = useRef(new Set());
  const page = useRef(new Map());

  useEffect(() => {
    if (!selectedOption.length) {
        setInputTags([]);
        setSelectedTag({});
        prevSelectedOption.current.clear();
        return;
    }
    const selectedSet = new Set(selectedOption.map(opt => opt.value));
    const newSelections = selectedOption.filter(opt => !prevSelectedOption.current.has(opt.value));

    // Remove tags for deselected options
    setInputTags(prevTags => prevTags.filter(tagObj => selectedSet.has(tagObj.lib.value)));
    setSelectedTag(prevTags => {
      const updatedTags = { ...prevTags };
      Object.keys(updatedTags).forEach(lib => {
          if (!selectedSet.has(lib)) delete updatedTags[lib];
      });
      return updatedTags;
  });

    newSelections.forEach(async (lib) => {
        const currPage = page.current.get(lib.value) || 1;
        console.log(`Fetching Tags: ${lib.value} : Page: ${currPage}`);

        const tagResponse = await searchRegistryService.fetchTags({ library: lib.value, page : currPage });
        if (tagResponse?.data?.tagNames.tags.length > 0) {
            setInputTags(prevTags => [...prevTags, { lib, tags: tagResponse.data.tagNames.tags, next : tagResponse.data.tagNames.next, prev :tagResponse.data.tagNames.prev }]);
        }
    });
    prevSelectedOption.current = selectedSet;
}, [selectedOption]);

const pagination = async (libValue, next) => {
  let newPage;
  if(next) {
    newPage = (page.current.get(libValue) || 1) + 1;
  }else{
    newPage = (page.current.get(libValue) || 1) - 1;
  }
  page.current.set(libValue, newPage);
  console.log(`Increasing Page for ${libValue} to ${newPage}`);
  const tagResponse = await searchRegistryService.fetchTags({ library: libValue, page: newPage });
  console.log(`next: ${tagResponse.data.tagNames.next} and prev: ${tagResponse.data.tagNames.prev}`)
  if (tagResponse?.data?.tagNames.tags.length > 0 && tagResponse.data.success) {
      setInputTags(prevTags => prevTags.map( tagObj => tagObj.lib.value === libValue ? { ...tagObj, tags: tagResponse.data.tagNames.tags, next: tagResponse.data.tagNames.next, prev: tagResponse.data.tagNames.prev } : tagObj ));
  }
};

const handleTagChange = (libValue, selectedTag) => {
  setSelectedTag(prev => ({ ...prev, [libValue]: selectedTag }));
};


useEffect(() => {
    const transformedSelectedOption = selectedOption.map(option => ({
      label : option.label,
      value : option.value,
      tag : selectedTag[option.value] || "latest"
    }));
    if(label === "Runtime(s)") setRuntime(transformedSelectedOption);
    if(label === "Database(s)") setDatabase(transformedSelectedOption);
    if(label === "Operating System") setOs(transformedSelectedOption);
}, [selectedOption, label, setOs, setRuntime, setDatabase, selectedTag]);

  return (
    <div className="border-2 border-gray-300/70 hover:border-gray-500/70 rounded-lg my-2 p-1 px-2">
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
              isLoading={ isLoading }
              isClearable
              noOptionsMessage={() => ( isLoading ? "Loading..." : "No options found" )}
          />
        </div>
      </div>
      {
      inputTags.length > 0 &&
      inputTags.map((tagDetails, key) => 
        <div key={key} className="grid md:grid-cols-[1fr_3fr] gap-2 my-1">
          <label htmlFor={tagDetails.lib.value} className="text-md font-medium text-gray-500">Select Tag for {tagDetails.lib.value}:</label>
          <div className="flex gap-4">
            <select 
            name={tagDetails.lib.value} 
            id={tagDetails.lib.value} 
            className="px-2 border-2 border-gray-300 rounded w-[60%]"
            value={selectedTag[tagDetails.lib.value] || ""}
            onChange={e => handleTagChange(tagDetails.lib.value, e.target.value)}
            >
              {tagDetails.tags.map((tag, key) => <option key={key}>{tag}</option>)}
            </select>
            {tagDetails.prev && <div className="p-1 px-2 bg-gray-300/60 rounded-md cursor-pointer flex items-center gap-1 text-gray-500 hover:text-gray-800 hover:bg-gray-300 font-medium" 
            onClick={() => pagination(tagDetails.lib.value, false)
            }>
              <GrFormPrevious className="text-lg"/> prev 100
            </div>}
            {tagDetails.next && <div className="p-1 px-2 bg-gray-300/60 rounded-md cursor-pointer flex items-center gap-1 text-gray-500 hover:text-gray-800 hover:bg-gray-300 font-medium" 
            onClick={() => pagination(tagDetails.lib.value, true)
            }>
              next 100 <GrFormNext className="text-lg"/>
            </div>}
          </div>
        </div>
      )
      }
    </div>
  );
});

export default DockerSearchComponent;
