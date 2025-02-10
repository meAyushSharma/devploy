import { useState } from "react"
import deployService from "../utils/deployService";

export const useTerminateService = () => {
    const [isTerminating, setIsTerminating] = useState(false);
    const [errorTerminating, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const terminateService = async ({ imgId, contId, contDockerId, imgDockerId }) => {
        if(isTerminating) return;
        if(!imgId || !contId || !contDockerId || !imgDockerId) {
            console.log("imgId/contId missing");
            setSuccess(false);
            return;
        }
        try {
            setIsTerminating(true);
            const response = await deployService.terminateService({ imgId, contId, contDockerId, imgDockerId });
            if(!response.data || !response.data?.success) {
                setIsTerminating(false);
                setSuccess(false);
                console.log(`Termination of imgId: ${imgId} and contId: ${contId} failed.`);
                return;
            }
            setSuccess(true);
        } catch(err) {
            console.log(`Error in terminating the service, imgId: ${imgId} and contId: ${contId} is: `, err);
            setSuccess(false);
            setError(err.message);
        } finally {
            setIsTerminating(false);
        }
    }

    return {
        terminateService, errorTerminating, isTerminating, success
    }
}