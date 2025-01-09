import { useRecoilState } from "recoil"
import { portAtom } from "../../store/atoms/networkAtoms/portsAtom"

export const ShowPorts = () => {
    const [ports, setPorts] = useRecoilState(portAtom);
    const delPort = (ind) => setPorts(ports => ports.filter((_,i) => i!=ind))
    return <div>
        {ports.map((item, key) => (<div key={key}>
            <div className="flex justify-around">
            -p <span>{item.host}</span>:<span>{item.container}</span> <span onClick={() => delPort(key)} className="cursor-pointer border-2">Delete</span>
            </div>
        </div>))}
    </div>
}