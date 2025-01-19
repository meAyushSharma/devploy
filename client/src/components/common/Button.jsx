import { memo } from "react";

const Button = memo(({children}) => {
    return <div className="grid place-content-center p-1 whitespace-nowrap text-white font-medium rounded-md cursor-pointer bg-violet-500 hover:bg-violet-600">
        {children}
    </div>
})

export default Button;