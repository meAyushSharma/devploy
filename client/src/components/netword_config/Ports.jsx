import { useState } from "react"
import { useSetRecoilState } from "recoil";
import { portAtom } from "../../store/atoms/networkAtoms/portsAtom";
import { TextInput } from "../common/TextInput";
import { Button } from "../common/Button";

export const Ports = () => {
    const [hostPort, setHostPort] = useState("");
    const [contPort, setContPort] = useState("");
    const setGlobalPort = useSetRecoilState(portAtom);
    const addPort = () => {
        if(hostPort!="" && contPort!=""){
            setGlobalPort(globalPort => [...globalPort, {host:hostPort, container:contPort}]);
            setContPort("");
            setHostPort("")
        }
    }
    return <div className="flex justify-around">
        <TextInput placeholder={"host port"} onChangeFun={(e) => setHostPort(e.target.value)} value={hostPort}/>
        <span>:</span>
        <TextInput placeholder={"container port"} onChangeFun={(e) => setContPort(e.target.value)} value={contPort}/>
        <Button label={"Add"} onClickFun={addPort}/>
    </div>
}