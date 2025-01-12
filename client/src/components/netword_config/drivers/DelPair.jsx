import { memo } from "react";
import { Button } from "../../common/Button";

export const DelPair = memo(({spanTextOneVal, spanTextTwoVal, label, onClickFun, spanTextOne, spanTextTwo}) => {
    return <div className="flex gap-2">
                {spanTextOne && <span>{spanTextOne}{spanTextOneVal}</span>}
                {spanTextTwo && <span>{spanTextTwo}{spanTextTwoVal}</span>}
                <Button label={label} onClickFun={onClickFun}/>
            </div>
})