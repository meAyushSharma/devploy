//! depreciated

import axios from "axios";

export const authLoginFun = async ({email, password, setAuth}) => {
    if(email, password){
        const updatedValue = { email, password };
        try {
            const sendData = await axios.post("http://localhost:3007/api/v1/auth/login", updatedValue, {
                headers :{ "Content-Type":"application/json" },
                withCredentials: true
            })
            if(await sendData.data.success){
                console.log(sendData.data.msg);
                setAuth(state => ({ ...state, ...updatedValue }));
                return true;
            }else{
                console.log("error saving user is: ", sendData.data.error);
                return false;
            }
        } catch(err) {
            console.error("error sending data for authLogin: ", err);
            return false;
        }
    }
}