export const localLoginFun = ({username, password}) => {
    try{
        const val = localStorage.getItem("localAuthObj");
        if(val) {
            const user = JSON.parse(val);
            if(user.username == username && user.localPassword == password){
                console.log("user successfully logged in!");
                return {
                    success: true
                }
            }else {
                console.error("wrong credentials!");
                return {
                    success: false,
                    cause: "Wrong credentials (┬┬﹏┬┬)",
                    redirect: "no"
                }
            }
        }else {
            console.error("no credential found on local storage for guest mode")
            return {
                success: false,
                cause: "No credentials found T_T",
                redirect: "/signup"
            }
        }
    }catch (err) {
        console.error("some error occured during guest login: ", err);
        return {
            success: false,
            cause:`${err.message || err}`,
            redirect:"no"
        }
    }
}