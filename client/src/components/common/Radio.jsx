import { memo } from "react";

export const Radio = memo(({value, name, id, onChangeFun, checked}) => {
    const capId = id.toUpperCase();
    return <div className="flex w-1/5 justify-around">
        <label htmlFor={id}>{capId}</label>
        <input type="radio" value={value} name={name} id={id} onChange={onChangeFun} checked={checked}/>
    </div>
})