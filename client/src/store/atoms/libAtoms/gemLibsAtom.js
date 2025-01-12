import { atom, atomFamily } from "recoil";

export const gemLibsAtom = atomFamily({
    key: "gemLibsAtom",
    default: []
});