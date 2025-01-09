import { atom } from "recoil";

export const ipvlanAtom = atom({
    key:"ipvlanAtom",
    default:{
        mode:"",
        pairs:[], // {subnet:"", gateway:""}
        parent:"",
        name:""
    }
})