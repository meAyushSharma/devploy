import { atom } from "recoil";

export const portAtom = atom({
    key:"portsAtom",
    default:[],
});
//{host:hostPort, container:contPort}