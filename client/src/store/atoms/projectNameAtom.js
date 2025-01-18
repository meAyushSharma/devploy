import { atomFamily } from "recoil";

export const projectNameAtom = atomFamily({
    key:"projectNameAtom",
    default: "my-dockerfile"
})