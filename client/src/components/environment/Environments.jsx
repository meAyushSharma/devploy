import { useRecoilState, useRecoilValue } from "recoil"
import { envVariablesAtom } from "../../store/atoms/envAtoms/envVariablesAtom"
import { memo, useState } from "react";
import { ShowEnv } from "./ShowEnv";
import { envValidAtom } from "../../store/atoms/envAtoms/envValidAtom";
import { TextInput } from "../common/TextInput";
import { Button } from "../common/Button";

export const Environments = memo(({type}) => {
    const show = useRecoilValue(envValidAtom(type));
    const [envVars, setEnvVars] = useRecoilState(envVariablesAtom(type));
    const [name, setName] = useState("");
    const [val, setVal] = useState("");
    const addEnv = () => {
        if(name!="" && val!=""){
            setEnvVars(envState => [...envState, {envName:name, envValue:val}]);
            setName("");
            setVal("");
        }
    }

    return show && <div>
        <div>
            Environment variable(s) :
        </div>
        <div className="flex justify-around">
            <TextInput placeholder={"env name"} onChangeFun={e => setName(e.target.value)} value={name}/>
            <span>=</span>
            <TextInput placeholder={"env value"} onChangeFun={e => setVal(e.target.value)} value={val}/>
            <Button label={"Add"} onClickFun={addEnv}/>
        </div>
        <ShowEnv type={type}/>
    </div>
})