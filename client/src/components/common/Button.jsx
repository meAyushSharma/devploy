import { memo } from "react";

export const Button = memo(({label, onClickFun}) => {
    return <div className="cursor-pointer" onClick={onClickFun}>
        {label}
    </div>
})