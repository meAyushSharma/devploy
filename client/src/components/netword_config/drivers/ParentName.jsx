import { memo } from "react";
import Button from "../../common/Button";
import TextInput from "../../common/TextInput";

const ParentName = memo(({heading, placeholder, value, setParent, createLabel, onClickCreateFun}) => {
    return (
        <div className="grid grid-cols-[2fr_4fr_4fr]">
            <span className="font-medium text-gray-800 text-lg place-content-center">{heading}</span>
            <div className="flex gap-8 my-2">
                <TextInput>
                    <input type="text" placeholder={placeholder} onChange={e => setParent(e.target.value)} value={value} className="w-full p-1 rounded-lg text-black placeholder-gray-800"/>
                </TextInput>
                <Button>
                    <button onClick={onClickCreateFun}>{createLabel}</button>
                </Button>
            </div>
        </div>
    )
})

export default ParentName;