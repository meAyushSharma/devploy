import { useSetRecoilState } from "recoil"
import { envValidAtom } from "../store/atoms/envAtoms/envValidAtom"
import { netValidAtom } from "../store/atoms/networkAtoms/netValidAtom";
import { CheckboxInput } from "./common/CheckboxInput"
import { memo } from "react";

export const Configurations = memo(({type}) => {
    const setEnvValid = useSetRecoilState(envValidAtom(type));
    const setNetValid = useSetRecoilState(netValidAtom(type));
    return <div>
        <CheckboxInput label={"Environment : "} name={"env"} id={"env"} onChangeFun={()=>setEnvValid(envState => !envState)}/>
        <CheckboxInput label={"Network configuration : "} name={"net"} id={"net"} onChangeFun={()=>setNetValid(netState => !netState)}/>
        {/* <CheckboxInput label={"Debugging Tools : "} name={"debug"} id={"debug"} onChangeFun={}/> */}
    </div>
})