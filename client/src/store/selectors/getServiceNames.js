import { selector } from "recoil";
import { serviceCountAtom } from "../atoms/serviceCountAtom";
import { projectNameAtom } from "../atoms/projectNameAtom";
import { serviceDelTrackerAtom } from "../atoms/serviceDelTrackerAtom";

export const getServiceNames = selector({
    key:"getServiceNames",
    get: ({get}) => {
        const services = [];
        const serviceCount = get(serviceCountAtom);
        const serviceDelTracker = get(serviceDelTrackerAtom);
        Array.from({length:serviceCount}).map((_,i) => {
            const service = `service${i+1}`;
            const name = get(projectNameAtom(service));
            if(serviceDelTracker.includes(i)) services.push("");
            else services.push(name)
        })
        return services;
    }
})