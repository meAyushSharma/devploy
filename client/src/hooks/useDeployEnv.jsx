import { useState } from "react";
import deployService from "../utils/deployService";
import { useNavigate } from "react-router-dom";

export const useDeployEnv = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [envDeployErr, setError] = useState(null);
    const navigate = useNavigate();
    const deployEnv = async ({envId}) => {
        if(isLoading) return;
        try{
            setIsLoading(true);
            const res = await deployService.deployEnvironment({envId});
            if(!res.data || !res.data.success) {
                console.log("Error during geeting response from server regarding env deploy is : ", res.data?.error)
                setError(res.data?.error);
                return;
            }
            navigate("/environment");
        } catch (err) {
            console.log("Error during useDeployEnv is: ", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    return {
        deployEnv, isLoading, envDeployErr
    }
}