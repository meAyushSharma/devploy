import { memo } from "react";
import TextInput from "../../common/TextInput";
import Button from "../../common/Button";

const SubGate = memo(({heading, subValue, setSub, gateValue, setGate, label, onClickFun}) => {
    return <div className="">
                    <span className="font-medium text-gray-800 text-lg">{heading}</span>
                    <div className="grid grid-cols-5 text-center my-2">
                        <span className="font-medium text-gray-800 items-center">--subnet </span>
                        <TextInput placeholder={"subnet: 192.168.50.0/24"} value={subValue} onChangeFun={e => setSub(e.target.value)}/>
                        <span className="font-medium text-gray-800 items-center">--gateway</span>
                        <TextInput placeholder={"gateway: 192.168.50.1"} value={gateValue} onChangeFun={e => setGate(e.target.value)}/>
                        <div className="w-full">
                            <div className="w-fit m-auto">
                                {/* <Button label={label} onClickFun={onClickFun}/> */}
                                <Button>
                                    <button onClick={onClickFun}>{label}</button>
                                </Button>
                            </div>
                        </div>
                    </div>
            </div>
})

export default SubGate;