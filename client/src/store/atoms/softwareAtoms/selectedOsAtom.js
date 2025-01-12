import { atom, atomFamily } from "recoil";

export const selectedOsAtom = atomFamily({
    key:"selectedOsAtom",
    default: []
});