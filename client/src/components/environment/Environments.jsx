import { useRecoilState, useRecoilValue } from "recoil"
import { lazy, memo, useState } from "react";
import { envVariablesAtom } from "../../store/atoms/envAtoms/envVariablesAtom"
import { envValidAtom } from "../../store/atoms/envAtoms/envValidAtom";

const ShowEnv = lazy(() => import("./ShowEnv"))
import TextInput from "../common/TextInput";
import Button from "../common/Button";

const Environments = memo(({type}) => {
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

    return show && (
    <div className="my-4 border-2 border-violet-500/50 hover:border-violet-500/100 p-2 rounded-lg">
        <div className="grid md:grid-cols-[1fr_4fr] my-4">
            <div className="flex items-center text-lg font-medium text-gray-800">Environment variable(s) :</div>
            <div className="grid md:grid-cols-[3fr_3fr_1fr] gap-4 items-center">
                <TextInput placeholder={"env name"} onChangeFun={e => setName(e.target.value)} value={name}/>
                <TextInput placeholder={"env value"} onChangeFun={e => setVal(e.target.value)} value={val}/>
                <div className="w-fit text-lg">
                    {/* <Button label={"Add Env"} onClickFun={addEnv}/> */}
                    <Button>
                        <button onClick={addEnv}>Add Env</button>
                    </Button>
                </div>
            </div>
        </div>
        <ShowEnv type={type}/>
    </div>
    )
})

export default Environments;