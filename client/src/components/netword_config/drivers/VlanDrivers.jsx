import { useRecoilState } from "recoil";
import { memo, useState } from "react";

import { ipvlanAtom } from "../../../store/atoms/networkAtoms/ipvlanAtom";
import { macvlanAtom } from "../../../store/atoms/networkAtoms/macvlanAtom";

import { CreateName } from "./CreateName";
import { SubGate } from "./SubGate";
import { DelPair } from "./DelPair";
import { ParentName } from "./ParentName";
import { NetworkModes } from "./NetworkModes";
// import ip from "ip";


export const VlanDrivers = memo(({vlan, type}) => {
    const ipvlan = vlan==="ipvlan";
    const macvlan = vlan==="macvlan";
    const [config, setVlanConfig] = useRecoilState(ipvlan ? ipvlanAtom(type) : macvlan ? macvlanAtom(type) : null);
    const [subnet, setSubnet] = useState("");
    const [gateway, setGateway] = useState("");
    const [parent, setParent] = useState("");
    const [name, setName] = useState("");

    // const isGatewayInCidr = (gateway, cidr) => {
    //     const [subnet, mask] = cidr.split('/');
    //     return ip.cidrSubnet(`${subnet}/${mask}`).contains(gateway);
    // };
    
    const delPair = (ind) => setVlanConfig(prevState => ({ ...prevState, pairs: prevState.pairs.filter((_,i) => i!=ind) }));
    const delParent = () => setVlanConfig(prevState => ({ ...prevState, parent:"" }));
    const addNet = () => setVlanConfig(prevState => ({ ...prevState, name:name }));
    const updateMode = e => setVlanConfig(prevState => ({ ...prevState, mode: e.target.value }));
    const addPair = () => {
        if(subnet!="" && gateway!=""){
            setVlanConfig(prevState => ({ ...prevState, pairs: [...prevState.pairs, {subnet:subnet, gateway:gateway}] }));
            setSubnet("");
            setGateway("");
        }
        else console.log("not cidr!")
    }
    const createParent = () => {
        setVlanConfig(prevState => ({...prevState, parent:parent}));
        setParent("");
    }

    const ipvlanOptions = [{ value:"l2", heading:"L2 (Layer 2) [default]"}, {value:"l3", heading:"L3 (Layer 3)"}];
    const macvlanOptions = [{value:"bridge", heading:"Bridge [default]"},{value:"vepa", heading:"Vepa"},{value:"passthru", heading:"Passthru"},{value:"private", heading:"Private"}];
    const options = ipvlan ? ipvlanOptions : macvlan ? macvlanOptions : [];

    return <div>
                <div>
                    <CreateName heading={"Create network name : "} placeholder={"network name"} value={name} onChangeFun={e => setName(e.target.value)} label={"Add/Update"} onClickFun={addNet} condition={config.name && <span className="font-medium text-gray-800 items-center">Network name is : {config.name}</span>}/>
                </div>
                <div>
                    <NetworkModes heading={ipvlan?"IPvLAN modes : ":macvlan?"MACvLAN modes : ":""} id={"modes"} onChangeFun={updateMode} defaultValue={ipvlan?"l2":macvlan?"bridge":""} options={options}/>
                </div>
                <div className="border-2 border-violet-500/50 hover:border-violet-500/100 rounded-lg p-2 my-2">
                    <SubGate heading={"Subnet and Gateway Address : "} subValue={subnet} setSub={setSubnet} gateValue={gateway} setGate={setGateway} label={"Add pair"} onClickFun={addPair}/>
                    {config.pairs.length>0 && 
                        <div className="border-2 border-violet-500/50 hover:border-violet-500/100 rounded-lg p-2">
                            {config.pairs.map((item, key) => <DelPair spanTextOneVal={item.subnet} spanTextTwoVal={item.gateway} label={"Delete"} onClickFun={() => delPair(key)} key={key} spanTextOne={"--subnet = "} spanTextTwo={"--gateway = "}/>)}
                        </div>
                    }
                </div>
                <div className="border-2 border-violet-500/50 hover:border-violet-500/100 rounded-lg p-2 mt-4">
                    <ParentName heading={"Parent name (host's network) : "} placeholder={"parent: eth0, eth0.10"} value={parent} setParent={setParent} createLabel={"Create/Update"} onClickCreateFun={createParent}/>
                    {config.parent.length>0 && <DelPair spanTextOne={"-o parent = "} spanTextOneVal={config.parent} label={"Delete"} onClickFun={delParent}/>}
                </div>
            </div>
})