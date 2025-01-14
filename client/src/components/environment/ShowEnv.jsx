import { useRecoilState } from "recoil"
import { envVariablesAtom } from "../../store/atoms/envAtoms/envVariablesAtom"
import { memo, useMemo } from "react";
import { MdDelete } from "react-icons/md";
import { IoCopy } from "react-icons/io5";

export const ShowEnv = memo(({type}) => {
    const [envs, setEnvVars] = useRecoilState(envVariablesAtom(type));
    const delEnv = (index) => setEnvVars(envState => envState.filter((_, i) => i!=index));
    let envString=``;
    const createEnvStr = useMemo(() => envs.map(env => envString+=`-e ${env.envName}=${env.envValue}\n`) , [envs, envString]);
    const copy = e => navigator.clipboard && navigator.clipboard.writeText(createEnvStr);

    return envs.length>0 && (
        <div>
            <pre>
                <code>
                    <div className="bg-slate-900 w-fit p-2 text-white font-medium rounded-md ml-2 shadow-2xl min-w-[30%] max-w-[90vw]">
                    <div className="">
                        <IoCopy className="ml-auto text-base cursor-pointer text-slate-500 hover:text-slate-300 mb-2" onClick={copy}/>
                    </div>
                    {envs.map((env, key) => {
                        return (
                                <div className="flex items-center" key={key}>
                                    <div className="mx-2 w-full overflow-x-auto" style={{scrollbarWidth:"thin"}}>-e {env.envName}={env.envValue}</div>
                                    <span className="w-full">
                                        <MdDelete onClick={() => delEnv(key)} className="w-fit ml-auto text-xl cursor-pointer text-slate-500 hover:text-slate-300"/>
                                    </span>
                                </div>
                        )
                    })}
                    </div>
                </code>
            </pre>
        </div>
    )
})