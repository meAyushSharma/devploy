import { memo } from "react";

export const Button = memo(({label, onClickFun}) => {
    return <div className="cursor-pointer border-2 p-3 w-fit" onClick={onClickFun}>
        {label}
    </div>
})