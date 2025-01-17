import { useRecoilState } from "recoil"
import { portAtom } from "../../store/atoms/networkAtoms/portsAtom"
import { memo, useMemo } from "react";
import { IoCopy } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

export const ShowPorts = memo(({type}) => {
    const [ports, setPorts] = useRecoilState(portAtom(type));
    const delPort = (ind) => setPorts(ports => ports.filter((_,i) => i!=ind))
    let portStr = ``;
    const createPortStr = useMemo(() => ports.map(port => portStr+=`-p ${port.host}:${port.container}\n`) , [ports, portStr]);
    const copy = e => navigator.clipboard && navigator.clipboard.writeText(createPortStr);
    
    return ports.length>0 && (
    <div className="min-w-[40vw] w-fit mr-auto mt-4 border-2 border-violet-500/70 rounded-lg">
            <IoCopy className="ml-auto text-base cursor-pointer text-slate-500 hover:text-slate-500/70 m-1" onClick={copy}/>
            <div className="border-2 border-violet-500/50 hover:border-violet-500/100 m-4 rounded-lg">
                    {ports.map((item, key) => {
                        return (
                            <div className="grid grid-cols-[1fr_50px] items-center max-w-[80vw]" key={key}>
                                    <div className="w-full max-w-[70vw] mx-2 overflow-x-auto whitespace-nowrap m-1 px-2 text-gray-700 font-medium" style={{scrollbarWidth:"thin"}}>-p {item.host} : {item.container}</div>
                                    <MdDelete onClick={() => delPort(key)} className="w-[40px] ml-auto text-xl cursor-pointer text-slate-500 hover:text-slate-500/70"/>
                            </div>
                        )
                    })}
            </div>
    </div>
    )
})