import { useState } from "react";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import { authSignupFun } from "../../helper/authSignupFun";
import { useNavigate } from "react-router-dom";
import { clearOpfsStorage } from "../../helper/clearOpfsStorage";
import { authLoginFun } from "../../helper/authLoginFun";

const AuthMode = ({setAuth, category}) => {
    const type = category === "Signup";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const authFun = async () => {
        if(type) {
            // auth = signup mode
            // via server
        if(email.trim() && password.trim()){
            const success = await authSignupFun({email:email.trim(), password:password.trim(), name:name.trim(), setAuth});
            if(success){
                // alert user added successfully
                setEmail("");
                setPassword("");
                setName("");
                localStorage.removeItem("localAuthToken");
                navigate("/");
                // const obj = await clearOpfsStorage();
                // if(obj.success){
                //     console.log("successfully cleared opfs directory and created anew!");
                // }else {
                //     console.log("error during clearing opfs in authSignup: ", obj.error);
                // }
            }else{
                // alert user of failure
            }
        }
        }else {
            // auth = login mode
            // via server
            if(email.trim() && password.trim()){
                const success = await authLoginFun({email:email.trim(), password:password.trim(), setAuth});
                if(success){
                    setEmail("");
                    setPassword("");
                    setName(""); //not necessary
                    localStorage.removeItem("localAuthToken");
                    navigate("/");
                    // const obj = await clearOpfsStorage();
                    // if(obj.success){
                    //     console.log("successfully cleared opfs directory and created anew!");
                    // }else {
                    //     console.log("error during clearing opfs in authSignup: ", obj.error);
                    // }
                }else {
                    // alert user of failure
                }
            }
        }
    }
    return (
    <div className="px-2">
        <div className="my-4">
            <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
                <div className="flex items-center md:justify-between text-lg font-medium text-gray-700">
                    <label htmlFor="email">Email<span className="text-rose-500">*</span></label>{":"}
                </div>
                <TextInput>
                    <input type="text" placeholder="johndoe@email.com" id="email" onChange={e => setEmail(e.target.value)} value={email} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                </TextInput>
            </div>
            <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
                <div className="flex items-center justify-between text-lg font-medium text-gray-700">
                    <label htmlFor="password">Password<span className="text-rose-500">*</span></label>{":"}
                </div>
                <TextInput>
                    <input type="text" placeholder="sh62538*&6434G" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                </TextInput>
            </div>
            {type && <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
                <div className="flex items-center justify-between text-lg font-medium text-gray-700">
                    <label htmlFor="name">Name</label>{":"}
                </div>
                <TextInput>
                    <input type="text" placeholder="John Doe" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                </TextInput>
            </div>}
        </div>
        <div onClick={authFun}>
            <Button>{category}</Button>
        </div>
    </div>
    )
}

export default AuthMode;