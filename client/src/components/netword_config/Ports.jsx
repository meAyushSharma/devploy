import { memo, useState } from "react"
import { useSetRecoilState } from "recoil";
import { portAtom } from "../../store/atoms/networkAtoms/portsAtom";
import { TextInput } from "../common/TextInput";
import { Button } from "../common/Button";

export const Ports = memo(({type}) => {
    const [hostPort, setHostPort] = useState("");
    const [contPort, setContPort] = useState("");
    const setGlobalPort = useSetRecoilState(portAtom(type));
    const addPort = () => {
        if(hostPort!="" && contPort!=""){
            setGlobalPort(globalPort => [...globalPort, {host:hostPort, container:contPort}]);
            setContPort("");
            setHostPort("")
        }
    }
    return <div className="my-4">
        <div className="grid md:grid-cols-[1fr_4fr]">
            <div className="flex text-lg font-medium text-gray-800">Expose Ports :</div>
            <div className="grid md:grid-cols-[3fr_3fr_1fr] gap-4 items-center">
                <TextInput placeholder={"host port"} onChangeFun={(e) => setHostPort(e.target.value)} value={hostPort}/>
                <TextInput placeholder={"container port"} onChangeFun={(e) => setContPort(e.target.value)} value={contPort}/>
                <div className="w-fit text-lg">
                    <Button label={"Add Port"} onClickFun={addPort}/>
                </div>
            </div>
        </div>
    </div>
})