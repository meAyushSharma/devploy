import { profilePicUrls } from "../utils/profilePicUrls";

export const localSignupFun = ({ username, localPassword, setLocalAuth, choosenPic }) => {
    try{
        if(username && localPassword){
            const localObj = localStorage.getItem("localAuthObj");
            // check for duplicacy => still left
            if(localObj) {
                alert("User is already using in guest mode");
                return false;
            }
            // setLocalAuth(state => ({ ...state, username, password:localPassword, profile_pic:choosenPic })); /* //! depreciated  */
            const localAuthObj = { username, localPassword, profile_pic : choosenPic || profilePicUrls[0] }
            localStorage.setItem("localAuthObj", JSON.stringify(localAuthObj));
            console.log("this is localAuthObj: ", localStorage.getItem("localAuthObj"));
            return true;
        }
    }catch(err) {
        console.error("error in storing localAuthData: ", err);
        return false;
    }
}