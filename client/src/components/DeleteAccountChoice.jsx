import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { useAlert } from "../hooks/useAlert";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

import { deleteToggleAtom } from "../store/atoms/deleteToggleAtom";
import { PiSealWarningFill } from "react-icons/pi";

const DeleteAccountChoice = () => {
    const navigate = useNavigate();
    const { deleteAccount, deleteError } = useDeleteAccount();
    const [deleteToggle, setDeleteToggle] = useRecoilState(deleteToggleAtom);

    const { showAlert } = useAlert();

    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
    const FRONTEND_DOMAIN = import.meta.env.VITE_FRONTEND_DOMAIN;

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

    return (deleteToggle && 
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 backdrop-blur pointer-events-auto"></div>
                <div className="
                    relative p-5 rounded-lg shadow-xl pointer-events-auto
                    bg-gray-950 border-2 border-dashed border-slate-300
                    md:text-lg sm:text-md text-xs md:px-10 sm:px-5 px-2">
                    
                    <div className="text-slate-200 font-medium mb-4 grid gap-2">
                        <span className="flex gap-2 items-center justify-center">
                            <PiSealWarningFill className="md:text-xl sm:text-md text-sm"/> This action is irreversible.
                        </span>
                        <span>
                            Do you confirm to delete your account?
                        </span>
                    </div>

                    <div className="flex justify-around mb-2">
                        <div className="cursor-pointer bg-slate-50 text-black rounded px-3 py-1 font-medium" onClick={() => setDeleteToggle(state => !state)}>
                            Stay
                        </div>
                        <div className="cursor-pointer bg-slate-50 text-black rounded px-3 py-1 font-medium" onClick={accountDeleteHandler}>
                            Delete
                        </div>
                    </div>
                </div>
            </div>

    )
}

export default DeleteAccountChoice;