import { memo } from "react";

const Button = memo(({children, disabled=false, padding="md:p-2 p-1", color="violet"}) => {
    return <div 
    className={`flex items-center sm:text-base text-sm justify-center gap-2 whitespace-nowrap ${padding} text-white font-medium rounded-full bg-${color}-500 hover:bg-${color}-600`}
    style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
        {children}
    </div>
})

export default Button;