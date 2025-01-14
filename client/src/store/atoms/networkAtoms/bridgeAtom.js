import {atom, atomFamily} from "recoil"
export const bridgeAtom = atomFamily({
    key:"bridgeAtom",
    default:""
})

// $ docker network create "name"