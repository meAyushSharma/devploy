import { atom, atomFamily } from "recoil";

export const npmLibsAtom = atomFamily({
    key: "npmLibsAtom",
    default: []
});
// [{value:value, label:label}]