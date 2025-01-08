import { useSetRecoilState } from "recoil"
import { envValidAtom } from "../store/atoms/envAtoms/envValidAtom"
import { netValidAtom } from "../store/atoms/networkAtoms/netValidAtom";

export const Configurations = () => {
    const setEnvValid = useSetRecoilState(envValidAtom);
    const setNetValid = useSetRecoilState(netValidAtom);
    return <div>
        <div>Environment : <input type="checkbox" name="env" id="env" onChange={()=>setEnvValid(envState => !envState)}/></div>
        <div>Network configuration : <input type="checkbox" name="net" id="net" onChange={()=>setNetValid(netState => !netState)}/></div>
        <div>Debugging Tools : <input type="checkbox" name="debug" id="debug" /></div>
    </div>
}