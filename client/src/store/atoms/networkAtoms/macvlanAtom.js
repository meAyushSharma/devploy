import { atom, atomFamily } from "recoil";

export const macvlanAtom = atomFamily({
    key:"macvlanAtom",
    default:{
        mode:"bridge",
        pairs:[], // {subnet:"", gateway:""}
        parent:"eth0",
        name:"macvlan"
    }
})