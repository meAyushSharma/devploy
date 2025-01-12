import { atom, atomFamily } from "recoil";

export const envValidAtom = atomFamily({
    key:"envValidAtom",
    default:false
})