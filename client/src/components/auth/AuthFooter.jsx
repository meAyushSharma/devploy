import { useEffect } from "react";
import Button from "../common/Button";
import { FaGoogle } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { clearStorageHelper } from "../../helper/clearStorageHelper";
import { useAlert } from "../../hooks/useAlert";

const AuthFooter = ({category}) => {
    const type = category === "Signup";
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const { data, isLoading, error, logUserIn } = useGoogleAuth();

    useEffect(() => {
        const afterGoogleAuth = async () => {
            console.log(data?.msg);
            const clearStorageObj = await clearStorageHelper({workerPath: "../worker/clearOpfsStorage.js"});
            if(clearStorageObj?.data?.success) {
                console.log("Google Authentication successfull, cleared opfs storage");
                showAlert("User login successfull (づ￣ 3￣)づ", "success");
                navigate("/");
            } else {
                console.error("Some error occured during clearing of opfs storage: ", clearStorageObj?.data);
                showAlert("Error logging user in (┬┬﹏┬┬)", "error");
            }
        }

        data && data?.success && afterGoogleAuth();
        data && !data?.success && console.error("Error during googleAuth is (from backend): ", data?.error) && showAlert("Error logging user in (┬┬﹏┬┬)", "error");

    }, [data]);

    useEffect(() => {error && showAlert("Error logging user in (┬┬﹏┬┬)", "error")}, [error]);

    return (
    <div>
        <div className="w-full h-[2px] bg-gray-500 sm:my-4 my-2"></div>
        <div onClick={logUserIn} style={{cursor:`${isLoading ? "not-allowed" : "pointer"}`, pointerEvents:`${isLoading ? "none" : "auto"}`}}>
            <Button>
               {isLoading ? <FiLoader className="animate-spin m-1"/> : <div className="flex items-center gap-3">Signup/Login with <FaGoogle /></div>} 
            </Button>
        </div>
        <div className="sm:text-sm text-xs font-medium text-gray-700 text-center mt-2">
                <span>{type ? "Already have an account ?": "Don't have an account ?"}{" "}</span>
                {type ? <a href="/login" className="hover:text-violet-950">Login</a> : <a href="/signup" className="hover:text-violet-950">Signup</a>}  
        </div>
    </div>
    )
}

export default AuthFooter;