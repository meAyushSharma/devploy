import { memo } from "react";
import { TextInput } from "../../common/TextInput";
import { Button } from "../../common/Button";

export const SubGate = memo(({heading, subValue, setSub, gateValue, setGate, label, onClickFun}) => {
    return <div>
                <span className="font-medium text-gray-800 text-lg m-2">{heading}</span>
                <div className="flex gap-8">
                    <span>--subnet </span>
                    <TextInput placeholder={"subnet: 192.168.50.0/24"} value={subValue} onChangeFun={e => setSub(e.target.value)}/>
                    <span>--gateway</span>
                    <TextInput placeholder={"gateway: 192.168.50.1"} value={gateValue} onChangeFun={e => setGate(e.target.value)}/>
                    <Button label={label} onClickFun={onClickFun}/>
                </div>
            </div>
})