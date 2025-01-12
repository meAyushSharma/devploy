import { atom, atomFamily } from "recoil";

export const selectedDatabaseAtom = atomFamily({
    key:"selectedDatabaseAtom",
    default: []
});