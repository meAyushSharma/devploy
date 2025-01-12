import { atom, atomFamily } from "recoil";

export const netValidAtom = atomFamily({
    key:"netValidAtom",
    default:false
})