import { memo } from "react";
import { MdDelete } from "react-icons/md";

export const DelPair = memo(({spanTextOneVal, spanTextTwoVal, label, onClickFun, spanTextOne, spanTextTwo}) => {
    return <div className="flex gap-8 font-medium text-gray-800 items-center min-w-[40vw] w-fit">
                {spanTextOne && <span>{spanTextOne}{spanTextOneVal}</span>}
                {spanTextTwo && <span>{spanTextTwo}{spanTextTwoVal}</span>}
                <MdDelete onClick={onClickFun} className="w-[40px] text-xl cursor-pointer text-slate-500 hover:text-slate-500/70"/>
            </div>
})