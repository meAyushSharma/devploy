import { useState } from "react";
import authService from "../utils/authService";

export const useMailVerification = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setError] = useState(null)

    const mailVerify = async ({email}) => {
        if(isVerifying) return;
        try {
            setIsVerifying(true);
            const response = await authService.verifyMail({email});
            if(!response.data?.success) {
                setError(response.data?.error);
                console.log("Error sending verification code is: ", response.data?.error);
                return false;
            }
            console.log("Successfully sent code to your registered mail!");
            return response.data.success;
        } catch (err) {
            setError(err?.message || err);
        } finally {
            setIsVerifying(false);
        }
    }

    return {
        mailVerify, isVerifying, verificationError
    }
}