import { selectorFamily } from "recoil";
import { selectedPackageManagerAtom } from "../atoms/libAtoms/selectedPackageManagerAtom";

//? not in use currently...
// Todo : used for fine-grained control packageManagers by making selector of each pm like : one for npm, one for pip etc... so if npm changes it does not effect selector of pip or others
export const packageManagerSelectorFamily = selectorFamily({
    key:"packageManagerSelector",
    get: id => ({get}) => {
        const packageManagers = get(selectedPackageManagerAtom);
        return packageManagers[id];
    }
})