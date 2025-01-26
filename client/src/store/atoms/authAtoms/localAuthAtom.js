import { atom } from "recoil";

export const localAuthAtom = atom({
    key:"localAuthAtom",
    default:{
        username: "",
        password: "",
        choosenPic: 2
    }
})