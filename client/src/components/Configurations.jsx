import { useSetRecoilState } from "recoil"
import { memo } from "react";

import { envValidAtom } from "../store/atoms/envAtoms/envValidAtom"
import { netValidAtom } from "../store/atoms/networkAtoms/netValidAtom";

import CheckboxInput from "./common/CheckboxInput"

const Configurations = memo(({type}) => {
    const setEnvValid = useSetRecoilState(envValidAtom(type));
    const setNetValid = useSetRecoilState(netValidAtom(type));
    return <div className="flex flex-col gap-2 border-2 rounded-lg p-2 my-4">
        <CheckboxInput label={"Environment : "} name={"env"} id={"env"} onChangeFun={()=>setEnvValid(envState => !envState)}/>
        <CheckboxInput label={"Network configuration : "} name={"net"} id={"net"} onChangeFun={()=>setNetValid(netState => !netState)}/>
        {/* <CheckboxInput label={"Debugging Tools : "} name={"debug"} id={"debug"} onChangeFun={}/> */}
    </div>
})

export default Configurations;