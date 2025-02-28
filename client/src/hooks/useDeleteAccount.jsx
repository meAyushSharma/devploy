import { useState } from "react"
import userApiService from "../utils/userApiService";

export const useDeleteAccount = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setError] = useState(null);

    const deleteAccount = async () => {
        if(isDeleting) return;
        let result = false;
        try{
            setIsDeleting(true);
            const res = await userApiService.deleteAccount();
            if(res.data?.success){
                console.log("User Account deleted successfully");
                result = true;
            }else{
                setError(res.data?.error);
                console.log("Error during account deletion: ", res.data?.error);
            }
        } catch(err) {
            setError(err.message || err);
            console.log("Error during account deletion: ", err);
        } finally {
            setIsDeleting(false);
        }
        return result;
    }

    return {
        deleteAccount, deleteError
    }
}