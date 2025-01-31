import { useState } from "react"
import { removeLocalHelper } from "../helper/removeLocalHelper";
import userApiService from "../utils/userApiService";

export const useDeleteFileData = ({setTrigger}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const delFun = async ({parentFolder, handle, delId, type}) => {
        if(!parentFolder || !handle || !delId) return;
        const isEnv = type === "env";
        setIsDeleting(true);
        try{
            const dbResponse = await (isEnv ? userApiService.deleteEnvironment({delId}) : userApiService.deleteCompose({delId}))
            if(dbResponse.data.success) {
                console.log(dbResponse.data.msg);
                const success = await removeLocalHelper(parentFolder, handle);
                if(success){
                    setTrigger(state => !state);
                    console.log("Successfully deleted environment file from local");
                }else {
                    console.log("Error during deletion of env file on local");
                    setError("Error during deletion of env file on local");
                    // alert user
                }
            }
            else {
                console.log("Error during deletion of environment file from Database: ", dbResponse.data.error);
                setError(dbResponse.data.error);
                // alert user
                alert("Error during deletion of environment file from Database");
            }
        }
        catch (err) {
            setError(err);
        }
        finally {
            setIsDeleting(false);
        }
    }
    return {
        delFun, isDeleting, error
    }
}