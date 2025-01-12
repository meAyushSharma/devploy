import { atom, atomFamily } from "recoil";

export const pipLibsAtom = atomFamily({
    key: "pipLibsAtom",
    default: []
});