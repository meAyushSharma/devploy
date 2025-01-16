import { atom, atomFamily } from "recoil";

export const envVariablesAtom = atomFamily({
    key:"envVariablesAtom",
    default:[]
})

// [{envValue:"", envName:""}]