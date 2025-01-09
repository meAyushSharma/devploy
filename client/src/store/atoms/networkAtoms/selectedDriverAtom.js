import { atom } from "recoil";

export const selectedDriverAtom = atom({
    key:"selectedDriverAtom",
    default:"bridge"
})
//"bridge", "host" etc