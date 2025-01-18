import { atom, atomFamily } from "recoil";

export const ipvlanAtom = atomFamily({
    key:"ipvlanAtom",
    default:{
        mode:"l2",
        pairs:[], // {subnet:"", gateway:""}
        parent:"eth0",
        name:"ipvlan"
    }
})