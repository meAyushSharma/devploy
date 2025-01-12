import { atom, atomFamily } from "recoil";

export const cargoLibsAtom = atomFamily({
    key: "cargoLibsAtom",
    default: []
});