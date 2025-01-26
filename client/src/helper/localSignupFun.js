export const localSignupFun = ({ username, localPassword, setLocalAuth, choosenPic }) => {
    try{
        console.log("here we are at localSignupFun")
        if(username && localPassword){
            setLocalAuth(state => ({ ...state, username, password:localPassword, choosenPic }));
            const localAuthObj = { username, localPassword, choosenPic }
            localStorage.setItem("localAuthToken", JSON.stringify(localAuthObj));
            console.log("this is localAuthObj: ", localStorage.getItem("localAuthToken"));
            return true;
        }
    }catch(err) {
        console.error("error in storing localAuthData: ", err);
        return false;
    }
}