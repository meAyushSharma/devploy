import { useRecoilState } from "recoil"
import { envVariablesAtom } from "../../store/atoms/envAtoms/envVariablesAtom"
import { memo, useMemo } from "react";
import { MdDelete } from "react-icons/md";
import { IoCopy } from "react-icons/io5"; // copy icon

const ShowEnv = memo(({type}) => {
    const [envs, setEnvVars] = useRecoilState(envVariablesAtom(type));
    const delEnv = (index) => setEnvVars(envState => envState.filter((_, i) => i!=index));
    let envString=``;
    const createEnvStr = useMemo(() => envs.map(env => envString+=`-e ${env.envName}=${env.envValue}\n`) , [envs, envString]);
    const copy = e => navigator.clipboard && navigator.clipboard.writeText(createEnvStr);
    
    return envs.length>0 && (
        <div className="min-w-[40vw] w-fit mr-auto mt-4 border-2 border-violet-500/70 rounded-lg">
            <IoCopy className="ml-auto md:text-base sm:text-md text-sm cursor-pointer text-slate-500 hover:text-slate-500/70 m-1" onClick={copy}/>
            <div className="border-2 border-violet-500/50 hover:border-violet-500/100 m-4 rounded-lg">
                    {envs.map((env, key) => {
                        return (
                            <div className="grid grid-cols-[1fr_50px] items-center max-w-[80vw]" key={key}>
                                    <div className="w-full max-w-[70vw] mx-2 overflow-x-auto whitespace-nowrap m-1 px-2 text-gray-700 font-medium" style={{scrollbarWidth:"thin"}}>-e {env.envName} = {env.envValue}</div>
                                    <MdDelete onClick={() => delEnv(key)} className="w-[40px] ml-auto text-xl cursor-pointer text-slate-500 hover:text-slate-500/70"/>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
})

export default ShowEnv