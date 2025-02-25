import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Modes from "../components/auth/Modes";
import { modeAtom } from "../store/atoms/authAtoms/modeAtom";
import AuthMode from "../components/auth/AuthMode";
import GuestMode from "../components/auth/GuestMode";
import { authAtom } from "../store/atoms/authAtoms/authAtom";
import { localAuthAtom } from "../store/atoms/authAtoms/localAuthAtom";
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
        isRegistered=="true";
        isRegistered=="true" && navigate("/")
    }, [isRegistered, navigate]);
    
    return !isRegistered && (
        <div className="font-Satoshi md:w-[35vw] w-[80vw] sm:w-[60vw] border-4 border-violet-500/60 hover:border-violet-500/80 m-auto mt-[10vh] rounded-lg p-2 mb-[5vh] text-sm sm:text-base">
            <Modes category={"Signup"}/>
            {mode === "auth" && <AuthMode setAuth={setAuth} category={"Signup"}/>}
            {mode === "local" && <GuestMode setLocalAuth={setLocalAuth} category={"Signup"}/>}
            <AuthFooter category={"Signup"}/>
        </div>
    )
}

export default Singup;