import { selector, selectorFamily } from "recoil";
import { selectedOsAtom } from "../atoms/softwareAtoms/selectedOsAtom";
import { selectedRuntimeAtom } from "../atoms/softwareAtoms/selectedRuntimeAtom";
import { selectedDatabaseAtom } from "../atoms/softwareAtoms/selectedDatabaseAtom";

export const softwareSelector = selectorFamily({
    key: "softwareSelector",
    get: id => ({get}) => {
        const os = get(selectedOsAtom(id));
        const runtime = get(selectedRuntimeAtom(id));
        const database = get(selectedDatabaseAtom(id));
        const softwares = [os, runtime, database];
        return softwares;
    }
})