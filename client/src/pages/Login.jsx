import { useRecoilState } from "recoil";
import { modeAtom } from "../store/atoms/authAtoms/modeAtom";
import Modes from "../components/auth/Modes";
import AuthMode from "../components/auth/AuthMode";
import { authAtom } from "../store/atoms/authAtoms/authAtom";
import GuestMode from "../components/auth/GuestMode";
import { localAuthAtom } from "../store/atoms/authAtoms/localAuthAtom";
import AuthFooter from "../components/auth/AuthFooter";

const Login = () => {
    const [mode, setMode] = useRecoilState(modeAtom);
    const [auth, setAuth] = useRecoilState(authAtom);
    const [localAuth, setLocalAuth] = useRecoilState(localAuthAtom);
    return (
        <div className="font-Satoshi w-[35vw] border-4 border-violet-500/60 hover:border-violet-500/80 m-auto mt-[10vh] rounded-lg p-2 mb-[5vh]">
            <Modes category={"Login"}/>
            {mode === "auth" && <AuthMode category={"Login"} setAuth={authAtom}/>}
            {mode === "local" && <GuestMode category={"Login"} setLocalAuth={setLocalAuth}/>}
            <AuthFooter category={"Login"}/>
        </div>
    )
}

export default Login;