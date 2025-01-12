import { atom, atomFamily } from "recoil";

export const selectedRuntimeAtom = atomFamily({
    key:"selectedRuntimeAtom",
    default: []
});