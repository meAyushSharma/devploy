import { atom } from "recoil";

export const authAtom = atom({
    key:"authAtom",
    default:{
        email:"",
        password:"",
        name:""
    }
})