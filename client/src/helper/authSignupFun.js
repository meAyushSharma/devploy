//! depreciated

import axios from "axios";
import { profilePicUrls } from "../utils/profilePicUrls";

export const authSignupFun = async ({email, password, name, setAuth}) => {
    if(email && password){
        const updatedValue = { email, password, name };
        try {
            const sendData = await axios.post("http://localhost:3007/api/v1/auth/signup", {...updatedValue, profile_pic: profilePicUrls[Math.floor(Math.random()*12)]}, {
                headers :{ "Content-Type":"application/json" },
                withCredentials: true
            })
            if(sendData.data.success){
                console.log(sendData.data.msg);
                setAuth(state => ({ ...state, ...updatedValue }));
                return true;
            }else{
                console.log(sendData.data.error);
                return false;
            }
        } catch(err) {
            console.error("error sending data for authSignup: ", err);
            return false;
        }
    }
}