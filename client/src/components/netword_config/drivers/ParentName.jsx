import { memo } from "react";
import Button from "../../common/Button";
import TextInput from "../../common/TextInput";

const ParentName = memo(({heading, placeholder, value, setParent, createLabel, onClickCreateFun}) => {
    return (
        <div className="grid grid-cols-[2fr_4fr_4fr]">
            <span className="font-medium text-gray-800 text-lg place-content-center">{heading}</span>
            <div className="flex gap-8 my-2">
                <TextInput placeholder={placeholder} value={value} onChangeFun={e => setParent(e.target.value)}/>
                <Button label={createLabel} onClickFun={onClickCreateFun}/>
            </div>
        </div>
    )
})

export default ParentName;