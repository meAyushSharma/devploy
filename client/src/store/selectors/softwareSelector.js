import { selector } from "recoil";
import { selectedOsAtom } from "../atoms/softwareAtoms/selectedOsAtom";
import { selectedRuntimeAtom } from "../atoms/softwareAtoms/selectedRuntimeAtom";
import { selectedDatabaseAtom } from "../atoms/softwareAtoms/selectedDatabaseAtom";

export const softwareSelector = selector({
    key: "softwareSelector",
    get: ({get}) => {
        const os = get(selectedOsAtom);
        const runtime = get(selectedRuntimeAtom);
        const database = get(selectedDatabaseAtom);
        const softwares = [os, runtime, database];
        console.log("this is os: ", os);
        console.log("this is runtime: ", runtime);
        console.log("this is database: ", database);
        return softwares;
    }
})