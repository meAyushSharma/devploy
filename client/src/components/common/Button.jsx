import { memo } from "react";

const Button = memo(({children}) => {
    return <div className="flex items-center justify-center gap-2 p-2 whitespace-nowrap text-white font-medium rounded-full cursor-pointer bg-violet-500 hover:bg-violet-600">
        {children}
    </div>
})

export default Button;