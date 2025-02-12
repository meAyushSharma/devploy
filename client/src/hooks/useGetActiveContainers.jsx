import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import deployService from "../utils/deployService";
import { userModeSelector } from "../store/selectors/userModeSelector";
import { envDeployDetails } from "../store/atoms/envDeployDetails";
import { openTerminalsAtom } from "../store/atoms/openTerminalsAtom";

export const useGetActiveContainers = () => {
    const [isGettingConts, setIsGettingConts] = useState(false);
    const [errorGettingContainers, setError] = useState(null);
    const token = useRecoilValue(userModeSelector);
    const setDeployDetails = useSetRecoilState(envDeployDetails);
    const setOpenTerminals = useSetRecoilState(openTerminalsAtom);
    const fetchContainers = async () => {
        if(isGettingConts) return;
        if(!token) {
            setError("Unauthorized Access Denied: no token on client")
            setIsGettingConts(false);
            return;
        }
        try {
            const response = await deployService.getActiveContainers();
            if(!response.data || !response.data?.success){
                console.log("No response found from server in getting active containers");
                setError("Invalid response from server");
                return;
            }
            const envNameSet = new Set();
            const sortedObj = {};
            setOpenTerminals(state => {
                return state.filter(terminal => {
                    const contIds = response.data.containers.map(conts => conts.id);
                    return contIds.includes(terminal.contId);
                })
            })
            response.data.containers.map(cont => envNameSet.add(cont.image.environment.name));

            const toBeSorted = response.data.containers.map(cont => {
                const urls = JSON.parse(cont.ports).map(port => ({
                    url:`http://${cont.name.split("-")[0]}-${port}.localhost?token=${token}`,
                    urlName: `${cont.name.split("-")[0]}-${port}.localhost`,
                    port,
                }));
                if(envNameSet.has(cont.image.environment.name)){
                    sortedObj[cont.image.environment.name] = [];
                }
                return {
                    envName: cont.image.environment.name,
                    details : {
                        urls,
                        created_at : cont.created_at,
                        envId: cont.image.environment.id,
                        envName: cont.image.environment.name,
                        token,
                        containerName: cont.name.split("-")[0],
                        containerId: cont.id,
                        imageId: cont.image.id,
                        contDockerId: cont.dockerId,
                        imgDockerId: cont.image.dockerId,
                    }
                }
            });

            toBeSorted.map(ele => {
                if(envNameSet.has(ele.envName)){
                    sortedObj[ele.envName] = [...sortedObj[ele.envName], ele.details];
                }
            })
            const activeContainersDetails = Object.entries(sortedObj);
            setDeployDetails(activeContainersDetails);
            // console.log("This is activeContainersDetails: ", activeContainersDetails);
        } catch (err) {
            console.log("Error during getting active containers is: ", err.message);
            setError(err.message);
        } finally {
            setIsGettingConts(false);
        }
    }
    return {
        fetchContainers, errorGettingContainers, isGettingConts
    }
}