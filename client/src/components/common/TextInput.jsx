import { memo } from "react";

export const TextInput = memo(({placeholder, value, onChangeFun}) => {
    return <div>
        <input type="text" placeholder={placeholder} onChange={onChangeFun} value={value}/>
    </div>
})
