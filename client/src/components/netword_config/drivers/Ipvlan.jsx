import { useRecoilState } from "recoil"
import { ipvlanAtom } from "../../../store/atoms/networkAtoms/ipvlanAtom"
import { TextInput } from "../../common/TextInput";
import { useState } from "react";
import { Button } from "../../common/Button";
// import ip from "ip";

export const Ipvlan = () => {
    const [ipvlanConfig, setIpvlanConfig] = useRecoilState(ipvlanAtom);
    const [subnet, setSubnet] = useState("");
    const [gateway, setGateway] = useState("");
    const [parent, setParent] = useState("");
    const [name, setName] = useState("");

    // const isGatewayInCidr = (gateway, cidr) => {
    //     const [subnet, mask] = cidr.split('/');
    //     return ip.cidrSubnet(`${subnet}/${mask}`).contains(gateway);
    // };

    const updateMode = e => setIpvlanConfig(prevState => ({ ...prevState, mode: e.target.value }));
    const addPair = () => {
        if(subnet!="" && gateway!=""){
            setIpvlanConfig(prevState => ({ ...prevState, pairs: [...prevState.pairs, {subnet:subnet, gateway:gateway}] }));
            setSubnet("");
            setGateway("");
        }else{
            console.log("not cidr!")
        }
    }
    const delPair = (ind) => setIpvlanConfig(prevState => ({ ...prevState, pairs: prevState.pairs.filter((_,i) => i!=ind) }));
    const createParent = () => {
        setIpvlanConfig(prevState => ({...prevState, parent:parent}));
        setParent("");
    }
    const delParent = () => setIpvlanConfig(prevState => ({ ...prevState, parent:"" }));
    const addNet = () => setIpvlanConfig(prevState => ({ ...prevState, name:name }));

    
    return <div>
                <div>
                    <span className="font-medium text-gray-800 text-lg m-2">Create network name : </span>
                    <div className="flex w-1/4 justify-around">
                        <TextInput placeholder={"network name"} value={name} onChangeFun={e => setName(e.target.value)}/>
                        <Button label={"Add/Update"} onClickFun={addNet}/>
                    </div>
                    {ipvlanConfig.name && <span>Network name is : {ipvlanConfig.name}</span>}
                </div>
                <div>
                    <label htmlFor="modes" className="font-medium text-gray-800 text-lg m-2">IPvLAN modes : </label>
                    <select name="modes" id="modes" onChange={updateMode} defaultValue={"l2"}>
                        <option value="l2">L2 (Layer 2) [default]</option>
                        <option value="l3">L3 (Layer 3)</option>
                    </select>
                </div>
                <div>
                    <span className="font-medium text-gray-800 text-lg m-2">Subnet and Gateway Address : </span>
                    <div className="flex gap-8">
                        <span>--subnet </span>
                        <TextInput placeholder={"subnet: 192.168.50.0/24"} value={subnet} onChangeFun={e => setSubnet(e.target.value)}/>
                        <span>--gateway</span>
                        <TextInput placeholder={"gateway: 192.168.50.1"} value={gateway} onChangeFun={e => setGateway(e.target.value)}/>
                        <Button label={"Add pair"} onClickFun={addPair}/>
                    </div>
                </div>
                {ipvlanConfig.pairs.length>0 && <div>
                    {ipvlanConfig.pairs.map((item, key) => (
                        <div key={key}>
                            <div className="flex gap-2">
                                <span> --subnet={item.subnet} </span>
                                <span> --gateway={item.gateway} </span>
                                <Button label={"Delete"} onClickFun={() => delPair(key)}/>
                            </div>
                        </div>
                    ))}
                </div>}
                <div>
                    <span className="font-medium text-gray-800 text-lg m-2">Parent name (host's network) : </span>
                    <div className="flex gap-8">
                        <TextInput placeholder="parent: eth0, eth0.10" value={parent} onChangeFun={e => setParent(e.target.value)}/>
                        <Button label={"Create/Update"} onClickFun={createParent}/>
                    </div>
                    {ipvlanConfig.parent.length>0 && <div className="flex gap-8">
                        <span>-o parent={ipvlanConfig.parent}</span>
                        <Button label={"Delete"} onClickFun={delParent}/>
                    </div>}
                </div>
            </div>
}