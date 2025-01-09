import { useRecoilState, useRecoilValue } from "recoil"
import { envVariablesAtom } from "../../store/atoms/envAtoms/envVariablesAtom"
import { useState } from "react";
import { ShowEnv } from "./ShowEnv";
import { envValidAtom } from "../../store/atoms/envAtoms/envValidAtom";
import { TextInput } from "../common/TextInput";
import { Button } from "../common/Button";

export const Environments = () => {
    const show = useRecoilValue(envValidAtom);
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
    const onChangeHandler = e => setName(e.target.value);
    return show ? <div>
        <div>
            Environment variable(s) :
        </div>
        <div className="flex justify-around">
            <TextInput placeholder={"env name"} onChangeFun={onChangeHandler} value={name}/>
            <span>=</span>
            <TextInput placeholder={"env value"} onChangeFun={onChangeHandler} value={val}/>
            <Button label={"Add"} onClickFun={addEnv}/>
        </div>
        <ShowEnv/>
    </div>:null
}