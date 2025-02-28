import { useState } from "react"

export const useResetPassword = ({apiService}) => {
    const [isResetting, setIsRestting] = useState(false);
    const [resetError, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const resetPass = async ({password, email="example@email.com", code="00000"}) => {
        if(isResetting) return;
        setIsRestting(true);
        let result = false;
        try {
            const response = await apiService({ password, email, code });
            if(!response.data?.success) {
                console.log(`Error during password reset is : ${response.data?.error}`);
                setError(response.data?.error);
                setSuccess(false);
            } else {
                setSuccess(true);
                console.log(`Successfully Resetted password`);
                result = true;
            }
        } catch (err) {
            console.log(`Error requesting password reset is: `, err);
            setError(err);
            setSuccess(false)
        } finally {
            setIsRestting(false);
        }
        return result;
    }

    return {
        success, resetError, resetPass, isResetting
    }
}