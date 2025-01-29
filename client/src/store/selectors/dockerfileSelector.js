import { selector } from "recoil";
import { serviceCountAtom } from "../atoms/serviceCountAtom";
import { testDockerfileAtom } from "../atoms/testDockerfileAtom";
import { getServiceNames } from "./getServiceNames";
import { serviceDelTrackerAtom } from "../atoms/serviceDelTrackerAtom";

// this selector will contain all the dockerfiles there is for either instance be it environment or docker-compose, and since it contains all of either, there is no need to make selector family.

export const dockerfileSelector = selector({
    key:"dockerfileSelector",
    get: ({get}) => {
        const dockerfiles = {environment:"", services:[]};
        const serviceCount = get(serviceCountAtom);
        const envDockerfileJSON = get(testDockerfileAtom("env"));
        if(envDockerfileJSON) dockerfiles.environment = envDockerfileJSON;
        const serviceNames = get(getServiceNames);
        if(serviceCount>0 && serviceNames.length>0){
            const serviceDelTracker = get(serviceDelTrackerAtom); // array
            Array.from({length:serviceCount}).map((_,i) => {
                if(!serviceDelTracker.includes(i)){
                    let service = `service${i+1}`;
                    const dockerfileJSON = get(testDockerfileAtom(service));
                    dockerfiles.services.push({dockerfileDetails:dockerfileJSON, name:serviceNames[i]}); // name not needed : depreciated
                }else{
                    dockerfiles.services.push({dockerfileDetails:"", name:""})
                }
            })
        }
        
        return dockerfiles;
    }
})