import { memo } from "react";

const Button = memo(({children, disabled=false}) => {
    return <div 
    className="flex items-center justify-center gap-2 p-2 whitespace-nowrap text-white font-medium rounded-full bg-violet-500 hover:bg-violet-600"
    style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
        {children}
    </div>
})

export default Button;