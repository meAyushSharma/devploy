import { memo, useState } from "react";
import { TextInput } from "../../common/TextInput";
import { Button } from "../../common/Button";
import { useRecoilState } from "recoil";
import { bridgeAtom } from "../../../store/atoms/networkAtoms/bridgeAtom";
import { CreateName } from "./CreateName";

export const Bridge = memo(({type}) => {
    const [netName, setNetName] = useState("");
    const [globalBridgeNet, setGlabalBridgeNet] = useRecoilState(bridgeAtom(type));
    const addNet = () => {
        if(netName!=""){
            setGlabalBridgeNet(netName);
            setNetName("");
        }
    }
    const delNet = () => setGlabalBridgeNet("");
    
    return <CreateName heading={"Create network name : "} placeholder={"network name"} value={netName} onChangeFun={e => setNetName(e.target.value)} label={"Create/Update"} onClickFun={addNet} condition={globalBridgeNet && (
    <div className="flex gap-8 items-center">
            <div className="font-medium text-gray-800 items-center">$ docker network create {globalBridgeNet}</div>
            <Button label={"Delete"} onClickFun={delNet}/>
    </div>
)}/>
})