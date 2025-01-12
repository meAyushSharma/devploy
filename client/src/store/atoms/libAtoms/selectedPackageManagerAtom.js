import { atom, atomFamily } from "recoil";

export const selectedPackageManagerAtom = atomFamily({
    key:"selectedPackageManagerAtom",
    default: []
});
// [{value:value, label:label}]