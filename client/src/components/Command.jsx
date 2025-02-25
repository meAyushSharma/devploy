import { useRecoilState } from "recoil";
import { useState, lazy } from "react";
import { commandAtom } from "../store/atoms/commandAtom";
const CreateName = lazy(() => import("./netword_config/drivers/CreateName"))
const Button = lazy(() => import("./common/Button"));

const Command = ({type}) => {
    const [globalCommand, setGlobalCommand] = useRecoilState(commandAtom(type));
    const [command, setCommand] = useState("/bin/sh");
    const addCommand = () => {
        if(command!=""){
            setGlobalCommand(command);
            setCommand("");
        }
    }
    const delCommand = () => setGlobalCommand("");
    return (
        <div>
            <CreateName 
        heading={"Create command : "} 
        placeholder={"/bin/sh"} 
        value={command} 
        onChangeFun={e => setCommand(e.target.value)} 
        label={"Create/Update"} 
        onClickFun={addCommand} 
        condition={
            (globalCommand && <div className="flex gap-8 items-center">
                <div className="font-medium text-gray-800 items-center md:text-xl sm:text-base text-sm">Command Name : {globalCommand}</div>
                <Button>
                    <button onClick={delCommand}>Delete</button>
                </Button>
            </div>)
        }/>
        </div>
    )
}

export default Command;