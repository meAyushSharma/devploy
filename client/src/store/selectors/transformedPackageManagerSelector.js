import { selector } from "recoil";
import { selectedPackageManagerAtom } from "../atoms/libAtoms/selectedPackageManagerAtom";

//? not in use currently
export const transformedPackageManagerSelector = selector({
    key:"transformedPackageManagerSelector",
    get: ({get}) => {
        const packageManagers = get(selectedPackageManagerAtom);
        return packageManagers.map(pm => ({
            value: pm.value,
            label:pm.label
        }));
    }
})