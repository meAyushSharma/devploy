import { atom } from "recoil";

export const userDetailsAtom = atom({
    key:"userDetailsAtom",
    default: {
        name:"",
        profile_pic:"https://res.cloudinary.com/dubrgx4b1/image/upload/v1737984769/pB_gmbdcv.png",
        email:""
    }
}); 