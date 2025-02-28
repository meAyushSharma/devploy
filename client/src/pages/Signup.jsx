import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { authAtom } from "../store/atoms/authAtoms/authAtom";
import { modeAtom } from "../store/atoms/authAtoms/modeAtom";
import { localAuthAtom } from "../store/atoms/authAtoms/localAuthAtom";

import { useRemoveCompatibility } from "../hooks/useRemoveCompatibility";

import Modes from "../components/auth/Modes";
import AuthMode from "../components/auth/AuthMode";
import GuestMode from "../components/auth/GuestMode";
import AuthFooter from "../components/auth/AuthFooter";


const Singup = () => {
    const [mode, setMode] = useRecoilState(modeAtom);
    const [auth, setAuth] = useRecoilState(authAtom);
    const [localAuth, setLocalAuth] = useRecoilState(localAuthAtom);
    const isUserRegistered = Cookies.get("isUserRegistered");
    const isGuestRegistered = Cookies.get("localAuthToken");
    const navigate = useNavigate();
    const isRegistered = isUserRegistered || isGuestRegistered;
    useEffect(() => {
        isRegistered=="true" && navigate("/")
    }, [isRegistered, navigate]);

    const { compatible } = useRemoveCompatibility();
    
    return (
        (!isRegistered && compatible) ?
        (<div className="font-Satoshi md:w-[35vw] w-[80vw] sm:w-[60vw] border-4 border-violet-500/60 hover:border-violet-500/80 m-auto mt-[10vh] rounded-lg p-2 mb-[5vh] text-sm sm:text-base">
            <Modes category={"Signup"}/>
            {mode === "auth" && <AuthMode setAuth={setAuth} category={"Signup"}/>}
            {mode === "local" && <GuestMode setLocalAuth={setLocalAuth} category={"Signup"}/>}
            <AuthFooter category={"Signup"}/>
        </div>)
        : 
        (<div className="font-Satoshi fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-2 bg-violet-50 rounded-lg shadow-xl md:text-lg sm:text-md text-xs md:px-10 sm:px-5 px-2">
            <div className="text-violet-700 font-semibold mb-4 grid gap-2">
                <span>
                    Your browser is not compatible with storage method Devploy uses, please switch browser.
                </span>
                <span>
                    Devploy uses Origin Private File System (OPFS), which is not supported in your current browser.
                </span>
                <span className="text-gray-950 text-base">
                    Suggestion: Use latest chromium based browsers like Chrome, Brave, Edge, Safari for best performance.
                </span>
            </div>
        </div>)
    )
}

export default Singup;