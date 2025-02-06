import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import {userDetailsAtom} from "../store/atoms/userDetailsAtom";

const Navbar = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);
    const [profilePic, setProfilePic] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [toggle, setToggle] = useState(false);
    const registerToken = Cookies.get("registerToken"); // jwt
    const googleToken = Cookies.get("googleToken"); // jwt
    const localAuthObj = localStorage.getItem("localAuthObj"); // obj
    const localAuthToken = Cookies.get("localAuthToken"); // t/f
    const isUserRegistered = Cookies.get("isUserRegistered"); // t/f

    // assume only one can be present
    const registered = localAuthToken || isUserRegistered
    const token = registerToken || googleToken || localAuthObj;
    useEffect(() => {
        if(token && registered){
            // profile_pic, email, name common in both
            const { profile_pic, email, name, username } = token==localAuthObj ? JSON.parse(token) : jwtDecode(token);
            console.log(profile_pic)
            setProfilePic(profile_pic);
            setEmail(email || username);
            setName(name || "");
            setUserDetails(state => ({...state, name, profile_pic, email}));
        }
    }, [token, setEmail, setName, setProfilePic, localAuthToken, registered]);

    const logoutFun = () => {
        Cookies.remove("registerToken")
        Cookies.remove("googleToken")
        Cookies.remove("localAuthToken", { path: "/" });
        Cookies.remove("isUserRegistered")
        if(isUserRegistered === "true"){
            const createDirectory = () => {
                const worker = new Worker(new URL('../worker/createDirectory.js', import.meta.url));
                worker.postMessage({});
                worker.onmessage = e => {
                  worker.terminate();
                  if(e.data.success) {
                    console.log("successfully created directory structure");
                    localStorage.removeItem("localAuthObj");
                    setEmail("");
                    navigate("/signup")
                  }else{
                    console.error("error occured during opfs directory structure creation: ", e.data.error);
                  }
                }
              }
              createDirectory();
        }else{
            setEmail("");
            navigate("/signup");
        }
    }

    return (
        <div className="font-Satoshi flex justify-around text-xl w-[90vw] m-auto border-b-2 rounded-lg">
            <div className="w-[40%]">
                <div className="cursor-pointer text-2xl font-semibold my-2 p-1 w-fit" onClick={() => navigate('/')}>DevBox</div>
            </div>
            <div className="flex justify-between items-center text-gray-700">
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={()=> navigate('/about')}>
                    About us
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={()=> navigate('/guide')}>
                    Guide
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/builds')}>
                    Builds
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>


                <div className={`mx-3 p-1 ${profilePic ? "cursor-pointer" : ""}`}>
            {email ?
                (
                <div className="relative group">
                    <div
                    className = {
                        `relative rounded-full w-[40px] h-[40px] ${profilePic ? "border-2 hover:border-white bg-violet-300" : ""} bg-contain bg-no-repeat bg-center grayscale hover:grayscale-0 hover:scale-150 hover:translate-y-6 hover:transition-all z-30 group-hover:z-40 group-has-[:nth-child(2):hover]:grayscale-0 group-has-[:nth-child(2):hover]:scale-150 group-has-[:nth-child(2):hover]:translate-y-6 shadow-lg`} style={{ backgroundImage: `url(${profilePic})`}} onClick={() => setToggle(t => !t)}
                    ></div>
                    {(
                        <div className="opacity-0 transform scale-75 pointer-events-none transition-all duration-300 ease-in-out absolute top-[60px] right-[-9vw] translate-x-[-20px] grid rounded-md text-base text-gray-700 font-medium border md:w-[18vw] z-30 group-hover:z-10 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto peer">
                            <span className="p-1 text-center text-sm h-auto flex flex-col whitespace-normal break-all bg-gray-300/30 hover:bg-gray-300/70 rounded-md m-1 ">
                                {email}
                            </span>
                            <span className="p-1 text-center h-auto whitespace-normal break-all bg-gray-300/30 hover:bg-gray-300/70 rounded-md mb-1 mx-1" onClick={logoutFun}>Logout</span>
                            <span className="p-1 text-center h-auto whitespace-normal break-all bg-gray-300/30 hover:bg-gray-300/70 rounded-md mb-1 mx-1">testAuth</span>
                            <span className="p-1 text-center h-auto whitespace-normal break-all bg-gray-300/30 hover:bg-gray-300/70 rounded-md mb-1 mx-1">Reset Password</span>
                        </div>)
                    }
                </div>
                ) :
                     (
                    <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/builds')}>
                        Signup
                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                    </div>
                    )}
                </div>

                
            </div>
        </div>
    )
}
export default Navbar;

