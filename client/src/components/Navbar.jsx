import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import {userDetailsAtom} from "../store/atoms/userDetailsAtom";
import { userModeSelector } from "../store/selectors/userModeSelector";

import { useAlert } from "../hooks/useAlert";
import { useResetPassword } from "../hooks/useResetPassword";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

import userApiService from "../utils/userApiService";

import { FiLoader } from "react-icons/fi";
import { PiSealWarningFill } from "react-icons/pi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { clearStorageHelper } from "../helper/clearStorageHelper";


const Navbar = () => {
    const navigate = useNavigate();
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
    const FRONTEND_DOMAIN = import.meta.env.VITE_FRONTEND_DOMAIN;
    console.log(`BACKEND_DOMAIN: ${BACKEND_DOMAIN}`)
    console.log(`FRONTEND_DOMAIN: ${FRONTEND_DOMAIN}`)
    const { showAlert } = useAlert();

    const isUserRegistered = useRecoilValue(userModeSelector);
    const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);

    const [profilePic, setProfilePic] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const [toggle, setToggle] = useState(false);
    const [toggleResetPass, setToggleResetPass] = useState(false);

    const [resetPassword, setResetPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [deleteToggle, setDeleteToggle] = useState(false);

    const localAuthObj = localStorage.getItem("localAuthObj"); // obj
    const localAuthToken = Cookies.get("localAuthToken"); // t/f

    // assume only one can be present
    const registered = isUserRegistered || localAuthToken;
    const token = isUserRegistered || localAuthObj;

    useEffect(() => {
        if(token && registered){
            // profile_pic, email, name common in both
            const { profile_pic, email, name, username } = token==localAuthObj ? JSON.parse(token) : jwtDecode(token);
            console.log(profile_pic)
            setProfilePic(profile_pic);
            setEmail(email || username);
            setName(name || "");
            setUserDetails(state => ({...state, name, profile_pic, email}));
        }
    }, [token, setEmail, setName, setProfilePic, localAuthToken, registered]);

    const logoutFun = async () => {
        /* A. Remove all cookies */
        Cookies.remove("registerToken", { path : "/", domain:BACKEND_DOMAIN });
        Cookies.remove("googleToken",  { path: "/", domain:BACKEND_DOMAIN });
        Cookies.remove("localAuthToken", { path: "/", domain:FRONTEND_DOMAIN });
        Cookies.remove("isUserRegistered", { path:"/", domain:BACKEND_DOMAIN });

        if(isUserRegistered) {
            /* 1. create/ensure directory structure */
            const createDirectory = async () => {
                const worker = new Worker(new URL('../worker/createDirectory.js', import.meta.url));
                worker.postMessage({});
                worker.onmessage = e => {
                    worker.terminate();
                    if(e.data.success) console.log("successfully created directory structure")
                    else console.error("error occured during opfs directory structure creation: ", e.data.error)
                }
            }
            await createDirectory();
            /* 2. clear directory */
            const clearDirectory = async () => {
                const clearStorageObj = await clearStorageHelper({workerPath: "../worker/clearOpfsStorage.js"});
                if(clearStorageObj?.data?.success) console.log("cleared opfs storage")
                else console.error("Some error occured during clearing of opfs storage: ", clearStorageObj.data)
            }
            await clearDirectory();
            /* 3. clear local auth obj and navigate */
            localStorage.removeItem("localAuthObj");
            showAlert("User logged out successfully (づ￣ 3￣)づ", "success");
            setEmail("");
            navigate("/signup");
        }
        
        else {
            showAlert("Guest user logged out successfully (づ￣ 3￣)づ", "success");
            setEmail("");
            navigate("/signup");
        }
    }

    const {success, resetError, resetPass, isResetting } = useResetPassword({apiService: userApiService.resetPassword});

    const resetHandler = async () => {
        const trimmedResetPass = resetPassword.trim();
        const trimmedConfirmPass = confirmPassword.trim();
        if(trimmedResetPass && trimmedConfirmPass && trimmedConfirmPass === trimmedResetPass && trimmedConfirmPass.length >= 8) {
            setConfirmPassword("");
            setResetPassword("");
            showAlert("Sending user password reset request...", "info");
            const res = await resetPass({ password: confirmPassword });
            if(res) {
                console.log("Successfully resetted password")
                showAlert("Password resetted successfully (づ￣ 3￣)づ", "success");
            }else {
                showAlert("Error during password reset", "error");
            }
        }
    }

    const { deleteAccount, deleteError } = useDeleteAccount();
    const accountDeleteHandler = async () => {
        setDeleteToggle(state => !state);
        const res = await deleteAccount();
        if(res) {
            showAlert("User Account deleted successfully <(＿　＿)>", "success");
            Cookies.remove("registerToken", { path : "/", domain:BACKEND_DOMAIN });
            Cookies.remove("googleToken",  {path: "/", domain:BACKEND_DOMAIN });
            Cookies.remove("isUserRegistered", {path:"/", domain:BACKEND_DOMAIN });
            Cookies.remove("localAuthToken", { path: "/", domain:FRONTEND_DOMAIN });
            setTimeout(() => {
                showAlert("Thank you for being with us (づ￣ 3￣)づ", "info");
                navigate("/");
            }, 3000)
        } else {
            showAlert(`${deleteError}`, "error");
        }
    }

    return (
    <div className="sticky top-0 backdrop-blur z-20">
        <div className="font-Satoshi flex justify-around md:text-xl text-xs sm:text-base w-[90vw] m-auto backdrop-blur-xl z-30 items-center">
            <div className="w-[40%]">
                <div className="cursor-pointer md:text-2xl font-semibold my-2 w-fit rounded-full" onClick={() => navigate('/')}>
                    <img src="https://res.cloudinary.com/dubrgx4b1/image/upload/v1740667912/devploy-high-resolution-logo-grayscale-transparent_1_pyyku8.png" alt="Devploy" className="md:h-[40px] h-[15px] sm:h-[25px]"/>
                </div>
            </div>
            <div className="flex md:justify-between justify-end items-center text-gray-700">
                <div className="md:mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/builds')}>
                    Builds
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="md:mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/environment')}>
                    Dashboard
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className={`mx-3 p-1 ${profilePic ? "cursor-pointer" : ""}`}>
                    {email ?
                    (
                    <div className="relative group">
                        {/* Profile Picture */}
                        <div
                            className={`
                                relative rounded-full 
                                md:w-[40px] md:h-[40px] sm:w-[30px] sm:h-[30px] w-[25px] h-[25px] 
                                ${profilePic ? "border-2 hover:border-white bg-violet-300" : ""} 
                                bg-contain bg-no-repeat bg-center grayscale hover:grayscale-0 
                                hover:scale-110 sm:hover:scale-125 md:hover:scale-150 
                                hover:translate-y-2 md:hover:translate-y-6 
                                transition-all duration-200 z-30 group-hover:z-40 shadow-lg
                                group-has-[:nth-child(2):hover]:grayscale-0 
                                group-has-[:nth-child(2):hover]:scale-150 
                                group-has-[:nth-child(2):hover]:translate-y-6
                            `}
                            style={{ backgroundImage: `url(${profilePic})` }}
                            onClick={() => setToggle((t) => !t)}
                        ></div>
                    
                        {/* Dropdown Menu */}
                        <div
                            className="
                                opacity-0 transform scale-90 pointer-events-none transition-all duration-300 
                                ease-in-out absolute top-full right-0 md:top-[60px] md:right-[-9vw] md:translate-x-[-20px] 
                                md:w-[18vw] sm:w-40 w-32 
                                bg-white rounded-md shadow-lg border z-30 
                                group-hover:z-10 group-hover:opacity-100 group-hover:scale-100 
                                group-hover:pointer-events-auto grid
                                text-xs sm:text-sm md:text-base"
                            >
                            <span className="p-2 text-center text-gray-700 font-medium block bg-gray-300/70 hover:bg-gray-300 rounded-md m-1 break-all">
                                {email}
                            </span>
                            <span className="mini-dashboard" onClick={logoutFun}>Logout</span>
                            {isUserRegistered && <span className="mini-dashboard" onClick={() => setToggleResetPass(state => !state)}>Reset Password</span>}
                            {toggleResetPass && (
                               <div className="grid grid-cols-1 gap-2 md:p-4 sm:p-2 p-1 w-full max-w-md mx-auto">
                               <input 
                                   type="text" 
                                   placeholder="New Password" 
                                   className="w-full p-1 border-2 border-gray-500 rounded-md text-xs sm:text-sm md:text-md"
                                   value={resetPassword} 
                                   onChange={e => setResetPassword(e.target.value)}
                               />
                               <input 
                                   type="text" 
                                   placeholder="Confirm Password" 
                                   className="w-full p-1 border-2 border-gray-500 rounded-md text-xs sm:text-sm md:text-md"
                                   value={confirmPassword} 
                                   onChange={e => setConfirmPassword(e.target.value)}
                               />
                           
                               {resetPassword.trim() !== confirmPassword.trim() ? (
                                   <div className="flex gap-1 items-center text-rose-500 text-xs">
                                       <IoInformationCircleOutline className="text-lg"/>
                                       <span>Confirm reset password</span>
                                   </div>
                               ) : resetPassword.trim().length >= 8 ? (
                                   <button 
                                       type="submit" 
                                       className="mini-dashboard"
                                       onClick={resetHandler}
                                   >
                                       {isResetting ? <FiLoader className="animate-spin"/> : "Reset"}
                                   </button>
                               ) : (
                                   <div className="flex gap-1 items-center text-rose-500 text-xs">
                                       <IoInformationCircleOutline className="text-lg"/>
                                       <span>Minimum 8 characters</span>
                                   </div>
                               )}
                           </div>
                           
                            )}
                            {isUserRegistered && <span className="mini-dashboard bg-rose-200 text-rose-700 hover:bg-rose-300" onClick={() => setDeleteToggle(state => !state)}>Delete Account</span>}
                        </div>
                    </div>
                ) :
                     (
                    <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/builds')}>
                        Signup
                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                    </div>
                    )}
                </div>
            </div>
        </div>
        {deleteToggle && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-2 bg-rose-50 my-20 rounded-lg shadow-xl md:text-lg sm:text-md text-xs md:px-10 sm:px-5 px-2">
                <div className="text-rose-700 font-medium mb-4 grid gap-2">
                    <span className="flex gap-2 items-center justify-center">
                        <PiSealWarningFill className="md:text-xl sm:text-md text-sm"/> This Action is irreversible.
                    </span>
                    <span>
                        Do you confirm to delete your account ?
                    </span>
                </div>
                <div className="flex justify-around mb-2">
                    <div className="cursor-pointer text-green-700 bg-green-200 rounded px-3 font-medium hover:bg-green-300/70" onClick={() => setDeleteToggle(state => !state)}>Stay</div>
                    <div className="cursor-pointer text-rose-700 bg-rose-200 rounded px-3 font-medium hover:bg-rose-300/70" onClick={accountDeleteHandler}>Delete</div>
                </div>
            </div>
        )}
    </div>
    )
}
export default Navbar;

