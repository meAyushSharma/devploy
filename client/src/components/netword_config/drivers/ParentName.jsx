import { memo } from "react";
import { Button } from "../../common/Button";
import { TextInput } from "../../common/TextInput";

export const ParentName = memo(({heading, placeholder, value, setParent, createLabel, onClickCreateFun}) => {
    return (
        <div>
            <span className="font-medium text-gray-800 text-lg m-2">{heading}</span>
            <div className="flex gap-8">
                <TextInput placeholder={placeholder} value={value} onChangeFun={e => setParent(e.target.value)}/>
                <Button label={createLabel} onClickFun={onClickCreateFun}/>
            </div>
        </div>
    )
})