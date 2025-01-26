import Modes from "../components/auth/Modes";
import { useRecoilState } from "recoil";
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
    return (
        <div className="font-Satoshi w-[35vw] border-4 border-violet-500/60 hover:border-violet-500/80 m-auto mt-[10vh] rounded-lg p-2 mb-[5vh]">
            <Modes category={"Signup"}/>
            {mode === "auth" && <AuthMode setAuth={setAuth} category={"Signup"}/>}
            {mode === "local" && <GuestMode setLocalAuth={setLocalAuth} category={"Signup"}/>}
            <AuthFooter category={"Signup"}/>
        </div>
    )
}

export default Singup;