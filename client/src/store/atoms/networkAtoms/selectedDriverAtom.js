import { atom, atomFamily } from "recoil";

export const selectedDriverAtom = atomFamily({
    key:"selectedDriverAtom",
    default:"bridge"
})
//"bridge", "host" etc