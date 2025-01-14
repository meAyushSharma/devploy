import { atomFamily } from "recoil";

export const testDockerfileAtom = atomFamily({
    key:"testDockerfileAtom",
    default: "",
})

// dockerfileJSON will be stored in it.