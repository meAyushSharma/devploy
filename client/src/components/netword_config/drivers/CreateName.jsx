import { memo } from "react";
import TextInput from "../../common/TextInput";
import Button from "../../common/Button";

const CreateName = memo(({heading, placeholder, value, onChangeFun, label, onClickFun, condition}) => {
        return <div className="border-2 border-violet-500/50 hover:border-violet-500/100 p-2 rounded-lg">
            <div className="grid md:grid-cols-[2fr_4fr_4fr] my-2">
                    <span className="font-medium text-gray-800 text-lg place-content-center">{heading}</span>
                    <div className="flex gap-8 my-2">
                        <TextInput placeholder={placeholder} value={value} onChangeFun={onChangeFun}/>
                        {/* <Button label={label} onClickFun={onClickFun}/> */}
                        <Button>
                                <button onClick={onClickFun}>{label}</button>
                        </Button>
                    </div>
            </div>
                    {condition}
            </div>
})

export default CreateName;