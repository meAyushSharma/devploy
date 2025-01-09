import { useRecoilState } from "recoil"
import { envVariablesAtom } from "../../store/atoms/envAtoms/envVariablesAtom"

export const ShowEnv = () => {
    const [envs, setEnvVars] = useRecoilState(envVariablesAtom);
    const delEnv = (index) => setEnvVars(envState => envState.filter((_, i) => i!=index));
    return <div>
        {envs.map((env, id) => {
            return <div key={id} className="flex justify-around border-2">
                <div className="border-2 w-1/5">
                    {env.envName}
                </div>
                <div className="border-2 w-2/5">
                    {env.envValue}
                </div>
                <div onClick={() => delEnv(id)} className="cursor-pointer border-2">
                    Delete
                </div>
            </div>
        })}
    </div>
}