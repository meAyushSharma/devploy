import { selector } from "recoil";
import { serviceCountAtom } from "../atoms/serviceCountAtom";
import { projectNameAtom } from "../atoms/projectNameAtom";

export const getServiceNames = selector({
    key:"getServiceNames",
    get: ({get}) => {
        const services = [];
        const serviceCount = get(serviceCountAtom);
        Array.from({length:serviceCount}).map((_,i) => {
            const service = `service${i+1}`;
            const name = get(projectNameAtom(service));
            services.push(name);
        })
        return services;
    }
})