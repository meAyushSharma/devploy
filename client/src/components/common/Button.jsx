import { memo } from "react";

export const Button = memo(({label, onClickFun}) => {
    return <div className="p-1 text-white font-medium rounded-md cursor-pointer bg-violet-500 hover:bg-violet-600 text-center" onClick={onClickFun}>
        {label}
    </div>
})