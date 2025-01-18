import {atom, atomFamily} from "recoil"
export const bridgeAtom = atomFamily({
    key:"bridgeAtom",
    default:"default_bridge_net"
})

// $ docker network create "name"