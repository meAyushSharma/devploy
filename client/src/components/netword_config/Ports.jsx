import { memo, useState } from "react"
import { useSetRecoilState } from "recoil";
import { portAtom } from "../../store/atoms/networkAtoms/portsAtom";
import TextInput from "../common/TextInput";
import Button from "../common/Button";

const Ports = memo(({type}) => {
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
    const checkNum = str => {
        if (typeof str != "string") return false;
        return !isNaN(+str) && !isNaN(parseFloat(+str))
    }
    const setChange = (val, setPort) => checkNum(val) && setPort(val);

    return <div className="my-4">
        <div className="grid md:grid-cols-[1fr_4fr]">
            <div className="flex text-lg font-medium text-gray-800 items-center">Expose Ports :</div>
            <div className="grid md:grid-cols-[3fr_3fr_1fr] gap-4 items-center">
                <TextInput>
                    <input type="text" placeholder={"host port"} onChange={e => setChange(e.target.value, setHostPort)} value={hostPort} className="w-full p-1 rounded-lg text-black placeholder-gray-800"/>
                </TextInput>
                <TextInput>
                    <input type="text" placeholder={"container port"} onChange={e => setChange(e.target.value, setContPort)} value={contPort} className="w-full p-1 rounded-lg text-black placeholder-gray-800"/>
                </TextInput>
                <div className="w-fit text-lg">
                    {/* <Button label={"Add Port"} onClickFun={addPort}/> */}
                    <Button>
                        <button onClick={addPort}>Add Port</button>
                    </Button>
                    
                </div>
            </div>
        </div>
    </div>
})

export default Ports;