import { lazy, memo, useState } from "react";
import { useRecoilState } from "recoil";
import { bridgeAtom } from "../../../store/atoms/networkAtoms/bridgeAtom";
import Button from "../../common/Button";
const CreateName = lazy(() => import("./CreateName"))

const Bridge = memo(({type}) => {
    const [netName, setNetName] = useState("default_bridge");
    const [globalBridgeNet, setGlabalBridgeNet] = useRecoilState(bridgeAtom(type));
    const addNet = () => {
        if(netName!=""){
            setGlabalBridgeNet(netName);
            setNetName("");
        }
    }
    const delNet = () => setGlabalBridgeNet("");
    
    return (
    <div>
        <CreateName 
        heading={"Create network name : "} 
        placeholder={"network name"} 
        value={netName} 
        onChangeFun={e => setNetName(e.target.value)} 
        label={"Create/Update"} 
        onClickFun={addNet} 
        condition={
            (globalBridgeNet && <div className="flex gap-8 items-center">
                <div className="font-medium text-gray-800 items-center">Network Name : {globalBridgeNet}</div>
                {/* <Button label={"Delete"} onClickFun={delNet}/> */}
                <Button>
                    <button onClick={delNet}>Delete</button>
                </Button>
            </div>)
        }/>

    </div>
)
});

export default Bridge;