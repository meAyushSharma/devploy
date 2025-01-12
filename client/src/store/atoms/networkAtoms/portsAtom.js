import { atom, atomFamily } from "recoil";

export const portAtom = atomFamily({
    key:"portsAtom",
    default:[],
});
//[{host:hostPort, container:contPort}]