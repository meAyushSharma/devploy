import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import authService from "../../utils/authService";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";
import { useMailVerification } from "../../hooks/useMailVerification";
import { validateInput } from "../../helper/validateAuthInput";
import { clearStorageHelper } from "../../helper/clearStorageHelper";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import { FiLoader } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";

const AuthMode = ({setAuth, category}) => {
    const type = category === "Signup";
    const navigate = useNavigate();

    const FRONTEND_DOMAIN = import.meta.env.VITE_FRONTEND_DOMAIN;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [errors, setErrors] = useState({});

    const [verified, setVerified] = useState(false);
    const [code, setCode] = useState("");

    const { mailVerify, isVerifying, verificationError } = useMailVerification({apiService: authService.verifyMail});
    const { success, isLoading, error, authFun } = useAuth({type});

    const { showAlert } = useAlert();

    useEffect(() => {
        const afterAuth = async () => {
            /* 1. reset values */
            setEmail("");
            setPassword("");
            setName("");
            /* 2. clear guest cookies and local auth object */
            Cookies.remove("localAuthToken", { path : "/", domain: FRONTEND_DOMAIN });
            localStorage.removeItem("localAuthToken");
            /* 3. creating/ensuring directory exists */
            const createDirectory = async () => {
                const worker = new Worker(new URL('../../worker/createDirectory.js', import.meta.url));
                worker.postMessage({});
                worker.onmessage = e => {
                    worker.terminate();
                    if(e.data.success) console.log("successfully created directory structure");
                    else console.error("error occured during opfs directory structure creation: ", e.data.error);
                }
            }
            await createDirectory();

            /* 4. clear directory */
            const clearStorageObj = await clearStorageHelper({workerPath: "../worker/clearOpfsStorage.js"});
            if(clearStorageObj?.data?.success) {
                console.log("Authentication successfull, cleared opfs storage");
                showAlert(`${type ? "User registered successfully (づ￣ 3￣)づ": "User logged in successfully (づ￣ 3￣)づ"}`, "success");
                navigate("/");
            }
            else {
                console.error("Some error occured during clearing of opfs storage: ", clearStorageObj.data)
                showAlert("Failed to clear storage (┬┬﹏┬┬)", "error");
            }
            /* 5. cookies are set by server */

        }
        success && afterAuth();
    }, [success, setEmail, setPassword, setName, navigate])

    useEffect(() => {
        if(error){
            showAlert("Error during registering user (┬┬﹏┬┬)", "error")
        }
        if(verificationError) {
            showAlert("Error sending verification code (┬┬﹏┬┬)", "error")
        }
    }, [error, verificationError])

    const inputErrorCheck = () => {
        const errors = validateInput({ email, password });
        setErrors(errors);
        if(Object.keys(errors).length == 0) authFun({ email: email.trim().toLowerCase(), password: password.trim(), setAuth, name: name.trim(), code: code.trim() });
    }

    const handleVerification = async () => {
        if(/\S+@\S+\.\S+/.test(email.trim().toLowerCase())){
            mailVerify({email: email.trim().toLowerCase()}).then(res => {
                if(res){
                    showAlert(`Successfully sent mail verification code (づ￣ 3￣)づ`, "info")
                } else {
                    showAlert("Error sending mail verification code (┬┬﹏┬┬)", "error");
                }
                setVerified(res)
            });
        }
    }
    
    return (
    <div className="px-2">
        <div className="my-4">
            <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
                <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
                    <label htmlFor="email">Email<span className="text-rose-500">*</span></label>{":"}
                </div>
                <TextInput>
                    <input type="email" placeholder="johndoe@email.com" id="email" onChange={e => setEmail(e.target.value)} value={email} className="w-full p-1 rounded-lg text-black placeholder-gray-700 sm:text-base text-sm"/>
                </TextInput>
                {errors.email && 
                <div className="flex gap-1 items-center">
                    <IoInformationCircleOutline className="text-rose-500 text-sm"/>
                    <span className="text-rose-500 text-sm whitespace-nowrap text-[12px]">{errors.email}</span>
                </div>
                }
            </div>
            <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
                <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
                    <label htmlFor="password">Password<span className="text-rose-500">*</span></label>{":"}
                </div>
                <TextInput>
                    <input type="text" placeholder="sh62538*&6434G =) 8 chars" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                </TextInput>
                {errors.password && (
                    <div className="flex gap-1 items-center">
                        <IoInformationCircleOutline className="text-rose-500 text-sm"/>
                        <span className="text-rose-500 whitespace-nowrap text-[12px]">{errors.password}</span>
                    </div>
                )}
            </div>
            {!type && (
                <div className="sm:text-sm text-end text-xs">
                    <span className="cursor-pointer text-violet-950 hover:bg-violet-100 rounded p-[2px]" onClick={() => navigate("/forgot-password")}>Forgot Password ?</span>
                </div>
            )}
            {type && <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
                <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
                    <label htmlFor="name">Name</label>{":"}
                </div>
                <TextInput>
                    <input type="text" placeholder="John Doe" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                </TextInput>
            </div>}
            {type && verified && <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
                <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
                    <label htmlFor="code">Code</label>{":"}
                </div>
                <TextInput>
                    <input type="text" placeholder="8972541" id="code" value={code} onChange={e => setCode(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                </TextInput>
            </div>
            }
        </div>
        {type && !verified && <div onClick={handleVerification} className="" style={{cursor:`${isVerifying ? "not-allowed" : "pointer"}`, pointerEvents:`${isVerifying ? "none" : "auto"}`}}>
            <Button>{isVerifying ? <FiLoader className="animate-spin m-1"/> : "Verify"}</Button>
        </div>
        }
        {type && verified && <div onClick={inputErrorCheck} className="" style={{cursor:`${isLoading ? "not-allowed" : "pointer"}`, pointerEvents:`${isLoading ? "none" : "auto"}`}}>
            <Button>{isLoading ? <FiLoader className="animate-spin m-1"/> : "Signup"}</Button>
        </div>
        }
       {!type && <div onClick={inputErrorCheck} className="" style={{cursor:`${isLoading ? "not-allowed" : "pointer"}`, pointerEvents:`${isLoading ? "none" : "auto"}`}}>
            <Button>{isLoading ? <FiLoader className="animate-spin m-1"/> : "Login"}</Button>
        </div>}
        {errors.missingFields && <div className="flex gap-1 items-center border w-fit m-auto">
            <IoInformationCircleOutline className="text-rose-500"/>
            <span className="text-rose-500 text-sm">{errors.missingFields}</span>
        </div>}
    </div>
    )
}

export default AuthMode;