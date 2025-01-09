import { memo } from "react";

export const CheckboxInput = memo(({label, name, id, onChangeFun}) => {
    return <div>
        <label htmlFor={id}>{label}</label>
        <input type="checkbox" name={name} id={id} onChange={onChangeFun}/>
    </div>
})