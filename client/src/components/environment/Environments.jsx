import { useRecoilState } from "recoil"
import { envVariablesAtom } from "../../store/atoms/envAtoms/envVariablesAtom"
import { useState } from "react";

export const Environments = () => {
    const [envVars, setEnvVars] = useRecoilState(envVariablesAtom);
    const [name, setName] = useState("");
    const [val, setVal] = useState("");
    const addEnv = () => {
        if(name!="" && val!=""){
            setEnvVars(envState => [...envState, {envName:name, envValue:val}]);
            setName("");
            setVal("");
        }
    }
    const delEnv = (index) => setEnvVars(envState => envState.filter((_, i)=> i!=index));
    return <div>
        <div>
            Environment variable(s) :
        </div>
        <div>
            <input type="text" placeholder="env name" onChange={e => setName(e.target.value)} value={name}/>
            <input type="text" placeholder="env value" onChange={e => setVal(e.target.value)} value={val}/>
            <button onClick={addEnv}>Add</button>
        </div>
        {(envVars.length>0)
            ? (<div> 
            {envVars.map((env, index) => (
                        <div key={index}>
                            --env {env.envName} = {env.envValue}
                            <button onClick={() => delEnv(index)}>delete</button>
                        </div>
            ))}</div>):null}
    </div>
}