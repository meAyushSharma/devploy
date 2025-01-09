import { useState } from "react";
import { TextInput } from "../../common/TextInput";
import { Button } from "../../common/Button";
import { useRecoilState } from "recoil";
import { bridgeAtom } from "../../../store/atoms/networkAtoms/bridgeAtom";

export const Bridge = () => {
    const [netName, setNetName] = useState("");
    const [globalBridgeNet, setGlabalBridgeNet] = useRecoilState(bridgeAtom);
    const addNet = () => {
        if(netName!=""){
            setGlabalBridgeNet(netName);
            setNetName("");
        }
    }
    const delNet = () => setGlabalBridgeNet("");
    return <div>
        <span className="font-medium text-gray-800 text-lg m-2">Create network : </span>
        <div className="flex w-1/4 justify-around">
        <TextInput placeholder={"network name"} value={netName} onChangeFun={e => setNetName(e.target.value)}/>
        <Button label={"Create/Update"} onClickFun={addNet}/>
        </div>
        {globalBridgeNet && <div className="flex gap-8">
            <div className="font-medium">$ docker network create {globalBridgeNet}</div>
            <Button label={"Delete"} onClickFun={delNet}/>
        </div>}
    </div>
}