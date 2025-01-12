import { memo } from "react";

export const NetworkModes = memo(({heading, id, onChangeFun, dafaultValue, options}) => {
    return (
        <div>
            <label htmlFor={id} className="font-medium text-gray-800 text-lg m-2">{heading}</label>
            <select name={id} id={id} onChange={onChangeFun} defaultValue={dafaultValue}>
                {options.map((option,key) => <option value={option.value} key={key}>{option.heading}</option>)}
            </select>
        </div>
    )
})