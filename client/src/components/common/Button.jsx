import { memo } from "react";

export const Button = memo(({label, onClickFun}) => {
    return <div className="cursor-pointer p-2 font-semibold shadow-md mx-2" onClick={onClickFun}>
        {label}
    </div>
})