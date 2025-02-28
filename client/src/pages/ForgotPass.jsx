import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateInput } from "../helper/validateAuthInput";
import { FiLoader } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { useMailVerification } from "../hooks/useMailVerification";
import authService from "../utils/authService";
import { useAlert } from "../hooks/useAlert";
import { useResetPassword } from "../hooks/useResetPassword";
import { userModeSelector } from "../store/selectors/userModeSelector";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

const ForgotPass = () => {
    const isUserRegistered = useRecoilValue(userModeSelector);
    const navigate = useNavigate();
    useEffect(() => {
        isUserRegistered && navigate("/");
    }, []);
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [verified, setVerified] = useState(false);
    const [code, setCode] = useState("");
    const { showAlert } = useAlert();
    const { mailVerify, isVerifying, verificationError } = useMailVerification({apiService: authService.verifyEmailForgotPassword});
    const {success, resetError, resetPass, isResetting } = useResetPassword({apiService: authService.resetForgottenPassword});
    const inputErrorCheck = async () => {
        if(confirmPass.trim() === newPass.trim()){
            const errors = validateInput({ email, password: confirmPass });
            setErrors(errors);
            if(Object.keys(errors).length == 0){
                const res = await resetPass({password: confirmPass.trim(), email: email.trim(), code: code.trim()});
                if(res) {
                    showAlert("Successfully resetted password (づ￣ 3￣)づ", "success");
                }else{ 
                    showAlert(`${resetError}`, "error");
                }
            }
        }
    }

    const handleVerification = () => {
        if(/\S+@\S+\.\S+/.test(email.trim().toLowerCase())) {
            mailVerify({email: email.trim().toLowerCase()}).then(res => {
                if(res){
                    showAlert(`Successfully sent mail verification code (づ￣ 3￣)づ`, "info")
                } else {
                    showAlert("Error sending mail verification code (┬┬﹏┬┬)", "error");
                }
                setVerified(res);
            });
        }
    }
    return (!isUserRegistered && 
        <div className="font-Satoshi md:w-[35vw] w-[80vw] sm:w-[60vw] border-4 border-violet-500/60 hover:border-violet-500/80 m-auto mt-[10vh] rounded-lg p-2 mb-[5vh] text-sm sm:text-base">
            <div className={`
                cursor-pointer text-center md:text-xl
                font-medium text-gray-700 bg-violet-500 
                active:bg-violet-950 bg-violet-950 text-white
                rounded-lg m-1 p-1 text-sm sm:text-base
                `}>Forgot Password</div>
            <div className="px-2">
                    <div className="my-4">
                        <div className="grid md:grid-cols-[2fr_3fr] gap-2 my-2">
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
                        {verified ? (
                            <div>
                                <div className="grid md:grid-cols-[2fr_3fr] gap-2 my-2">
                                    <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
                                        <label htmlFor="newPass">Reset Password<span className="text-rose-500">*</span></label>{":"}
                                    </div>
                                    <TextInput>
                                        <input type="text" placeholder="sh62538*&6434G =) 8 chars" id="newPass" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                                    </TextInput>
                                    {errors.password && (
                                        <div className="flex gap-1 items-center">
                                            <IoInformationCircleOutline className="text-rose-500 text-sm"/>
                                            <span className="text-rose-500 whitespace-nowrap text-[12px]">{errors.password}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-[2fr_3fr] gap-2 my-2">
                                    <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
                                        <label htmlFor="confirmPass">Confirm Password<span className="text-rose-500">*</span></label>{":"}
                                    </div>
                                    <TextInput>
                                        <input type="text" placeholder="sh62538*&6434G =) 8 chars" id="confirmPass" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                                    </TextInput>
                                    {errors.password && (
                                        <div className="flex gap-1 items-center">
                                            <IoInformationCircleOutline className="text-rose-500 text-sm"/>
                                            <span className="text-rose-500 whitespace-nowrap text-[12px]">{errors.password}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-[2fr_3fr] gap-2 my-2">
                                    <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
                                        <label htmlFor="code">Code</label>{":"}
                                    </div>
                                    <TextInput>
                                        <input type="text" placeholder="8972541" id="code" value={code} onChange={e => setCode(e.target.value)} className="w-full p-1 rounded-lg text-black placeholder-gray-700"/>
                                    </TextInput>
                                </div>
                                {confirmPass.trim()!=newPass.trim() && (
                                    <div className="flex gap-1 items-center">
                                        <IoInformationCircleOutline className="text-rose-500 text-sm"/>
                                        <span className="text-rose-500 whitespace-nowrap text-[12px]">Confirm password not matching</span>
                                    </div>
                                )}
                            </div>) : (
                                    <div onClick={handleVerification} className="" style={{cursor:`${isVerifying ? "not-allowed" : "pointer"}`, pointerEvents:`${isVerifying ? "none" : "auto"}`}}>
                                        <Button>{isVerifying ? <FiLoader className="animate-spin m-1"/> : "Verify"}</Button>
                                    </div>
                            )}
                    </div>
                    {verified && <div onClick={inputErrorCheck} className="" style={{cursor:`${isResetting ? "not-allowed" : "pointer"}`, pointerEvents:`${isResetting ? "none" : "auto"}`}}>
                        <Button>{isResetting ? <FiLoader className="animate-spin m-1"/> : "Reset Password"}</Button>
                    </div>
                    }
                    {errors.missingFields && <div className="flex gap-1 items-center border w-fit m-auto">
                        <IoInformationCircleOutline className="text-rose-500"/>
                        <span className="text-rose-500 text-sm">{errors.missingFields}</span>
                    </div>}
                </div>
                <div className="w-full h-[2px] bg-gray-500 sm:my-4 my-2"></div>
                <div>
                    <Button>
                        <div className="flex items-center gap-3" onClick={() => navigate("/login")}>Login</div>
                    </Button>
                </div>
        </div>
    )
}

export default ForgotPass;