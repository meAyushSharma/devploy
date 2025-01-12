import { selector } from "recoil";
import { serviceCountAtom } from "../atoms/serviceCountAtom";
import { testDockerfileAtom } from "../atoms/testDockerfileAtom";
import { getServiceNames } from "./getServiceNames";

export const dockerfileSelector = selector({
    key:"dockerfileSelector",
    get: ({get}) => {
        const dockerfiles = {environment:"", services:[]};
        const serviceCount = get(serviceCountAtom);
        const envDockerfile = get(testDockerfileAtom("env"));
        if(envDockerfile) dockerfiles.environment = envDockerfile;
        const serviceNames = get(getServiceNames);
        if(serviceCount>0 && serviceNames.length>0){
            Array.from({length:serviceCount}).map((_,i) => {
                let service = `service${i+1}`;
                const dockerfile = get(testDockerfileAtom(service));
                dockerfiles.services.push({dockerfile:dockerfile, name:serviceNames[i]});
            })
        }
        
        return dockerfiles;
    }
})