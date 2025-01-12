import { memo } from "react";

export const TextInput = memo(({placeholder, value, onChangeFun}) => {
    return <div className="border-2 rounded">
        <input type="text" placeholder={placeholder} onChange={onChangeFun} value={value}/>
    </div>
})
