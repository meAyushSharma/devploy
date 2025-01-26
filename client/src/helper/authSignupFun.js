import axios from "axios";

export const authSignupFun = async ({email, password, name, setAuth}) => {
    if(email && password){
        const updatedValue = { email, password, name };
        setAuth(state => ({ ...state, email, password, name }));
        try {
            const sendData = await axios.post("http://localhost:3007/api/v1/auth", { auth: JSON.stringify(updatedValue) }, {
                headers :{ "Content-Type":"application/json" }
            })
            if(await sendData.data.success){
                console.log("User successfully added: ", sendData.data.user);
                return true;
            }else{
                console.log("error saving user is: ", sendData.data.error);
                return false;
            }
        } catch(err) {
            console.error("error sending data for authSignup: ", err);
            return false;
        }
    }
}