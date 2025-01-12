import { memo } from "react";

export const Button = memo(({label, onClickFun}) => {
    return <div className="cursor-pointer p-2 w-fit rounded-lg font-semibold bg-green-500 text-white shadow-md" onClick={onClickFun}>
        {label}
    </div>
})