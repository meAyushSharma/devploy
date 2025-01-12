import { memo } from "react";
import { TextInput } from "../../common/TextInput";
import { Button } from "../../common/Button";

export const CreateName = memo(({heading, placeholder, value, onChangeFun, label, onClickFun, condition}) => {
        return <div>
                    <span className="font-medium text-gray-800 text-lg m-2">{heading}</span>
                    <div className="flex w-1/4 justify-around">
                        <TextInput placeholder={placeholder} value={value} onChangeFun={onChangeFun}/>
                        <Button label={label} onClickFun={onClickFun}/>
                    </div>
                    {condition}
            </div>
})