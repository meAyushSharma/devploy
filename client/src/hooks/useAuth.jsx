import { useState } from "react";
import authService from "../utils/authService";
import { profilePicUrls } from "../utils/profilePicUrls";

export const useAuth = ({type}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const authFun = async ({email, password, setAuth, name}) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try{
            if(!email.trim() || !password.trim()) throw new Error("Email and password are required");
            const updatedValue = { email, password, name, profile_pic: profilePicUrls[Math.floor(Math.random()*12)]};
            const sendData = await (type ? authService.registerUser(updatedValue) : authService.loginUser(updatedValue))
            if(await sendData.data.success){
                console.log(sendData.data.msg);
                // setAuth(state => ({ ...state, ...updatedValue })); /* //! depreciated  */
                setSuccess(true);
            }else{
                console.log("error saving user is: ", sendData.data.error);
                throw new Error(sendData.data.error || "Unknown error");
            }
        }
        catch(err) {
            console.error("error sending data for authLogin: ", err);
            setError(err.message || "An unexpected error occurred");
            setSuccess(false);
        }
        finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        authFun,
        success
    }
}