import { memo } from "react";

const NetworkModes = memo(({heading, id, onChangeFun, dafaultValue, options}) => {
    return (
        <div className="grid sm:grid-cols-[2fr_2fr_6fr] my-4">
            <label htmlFor={id} className="font-medium text-gray-800 md:text-lg sm:text-base text-sm">{heading}</label>
            <select name={id} id={id} onChange={onChangeFun} defaultValue={dafaultValue} className="w-full text-center p-0 text-sm text-gray-700 font-medium bg-transparent border-0 border-b-2 border-gray-200 rounded-lg">
                {options.map((option,key) => <option value={option.value} key={key}>{option.heading}</option>)}
            </select>
        </div>
    )
})

export default NetworkModes;