export const localSignupFun = ({ username, localPassword, setLocalAuth, choosenPic }) => {
    try{
        if(username && localPassword){
            const localObj = localStorage.getItem("localAuthObj");
            
            setLocalAuth(state => ({ ...state, username, password:localPassword, profile_pic:choosenPic }));
            const localAuthObj = { username, localPassword, profile_pic:choosenPic }
            localStorage.setItem("localAuthObj", JSON.stringify(localAuthObj));
            console.log("this is localAuthObj: ", localStorage.getItem("localAuthObj"));
            return true;
        }
    }catch(err) {
        console.error("error in storing localAuthData: ", err);
        return false;
    }
}