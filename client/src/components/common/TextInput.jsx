import { memo } from "react";

const TextInput = memo(({placeholder, value, onChangeFun}) => {
    return <div className="border-2 focus:ring-blue-500 border-violet-500 rounded-lg text-black">
        <input type="text" placeholder={placeholder} onChange={onChangeFun} value={value} className="w-full p-1 rounded-lg text-black placeholder-gray-800"/>
    </div>
})

export default TextInput;
