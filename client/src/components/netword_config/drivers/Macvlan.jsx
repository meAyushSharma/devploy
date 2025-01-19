import { useRecoilState } from "recoil";
import { lazy, useState } from "react";
import { macvlanAtom } from "../../../store/atoms/networkAtoms/macvlanAtom";

const CreateName = lazy(() => import("./CreateName"))
const NetworkModes = lazy(() => import("./NetworkModes"))
const DelPair = lazy(() => import("./DelPair"))
const SubGate = lazy(() => import("./SubGate"))

const Macvlan = () => {
    const [name, setName] = useState("");
    const [subnet, setSubnet] = useState("");
    const [gateway, setGateway] = useState("");
    const [parent, setParent] = useState("");
    const [macvlanConfig, setMacvlanConfig] = useRecoilState(macvlanAtom);
    const addNet = () => setMacvlanConfig(prevState => ({ ...prevState, name:name }));
    const updateMode = e => setMacvlanConfig(prevState => ({ ...prevState, mode: e.target.value }));
    const options = [{value:"bridge", heading:"Bridge [default]"},{value:"vepa", heading:"Vepa"},{value:"passthru", heading:"Passthru"},{value:"private", heading:"Private"}]
    return (
    <div>
        <div>
            <CreateName heading={"Create network name : "} placeholder={"network name"} value={name} onChangeFun={e => setName(e.target.value)} label={"Add/Update"} onClickFun={addNet} condition={macvlanConfig.name && <span>Network name is : {macvlanConfig.name}</span>}/>
        </div>
        <div>
            <NetworkModes heading={"MACvLAN modes : "} id={"modes"} onChangeFun={updateMode} defaultValue={"bridge"} options={options}/>
        </div>
        <div>
            <SubGate heading={"Subnet and Gateway Address : "} subValue={subnet} setSub={setSubnet} gateValue={gateway} setGate={setGateway} label={"Add pair"} onClickFun={addPair}/>
        </div>
        {macvlanConfig.pairs.length>0 && 
            <div>
                {macvlanConfig.pairs.map((item, key) => <DelPair spanTextOneVal={item.subnet} spanTextTwoVal={item.gateway} label={"Delete"} onClickFun={() => delPair(key)} key={key} spanTextOne={"--subnet="} spanTextTwo={"--gateway="}/>)}
            </div>
        }
    </div>
    )
}

export default Macvlan;