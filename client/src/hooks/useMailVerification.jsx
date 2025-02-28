import { useState } from "react";

export const useMailVerification = ({apiService}) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setError] = useState(null)

    const mailVerify = async ({email}) => {
        if(isVerifying) return;
        let result = false;
        try {
            setIsVerifying(true);
            const response = await apiService({email});
            if(!response.data?.success) {
                setError(response.data?.error);
                console.log("Error sending verification code is: ", response.data?.error);
            }
            console.log("Successfully sent code to your registered email!");
            result = response.data.success;
        } catch (err) {
            setError(err?.message || err);
        } finally {
            setIsVerifying(false);
        }
        return result;
    }

    return {
        mailVerify, isVerifying, verificationError
    }
}