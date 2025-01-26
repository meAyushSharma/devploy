import { memo } from "react";

const TextInput = memo(({children}) => {
    return <div className="border-2 focus:ring-blue-500 border-violet-500 rounded-lg text-black">
        {children}
    </div>
})

export default TextInput;
