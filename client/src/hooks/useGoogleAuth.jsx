import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react"
import authService from "../utils/authService";

export const useGoogleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const login = useGoogleLogin({
        onSuccess : async ({code}) => {
            const res = await authService.googleAuth({code});
            setData(res.data);
            setIsLoading(false);
        },
        onError : (err) => {
            console.log("error is: ", err);
            setIsLoading(false);
            setError(err);
        },
        flow:"auth-code",
    })

    const logUserIn = () => {
        if(isLoading) return;
        setIsLoading(true);
        setError(null);
        login();
    }
    return {
        logUserIn, isLoading, data, error
    }
}