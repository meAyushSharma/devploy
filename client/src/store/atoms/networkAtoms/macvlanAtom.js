import { atom, atomFamily } from "recoil";

export const macvlanAtom = atomFamily({
    key:"macvlanAtom",
    default:{
        mode:"",
        pairs:[], // {subnet:"", gateway:""}
        parent:"",
        name:""
    }
})