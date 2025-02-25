import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import {userDetailsAtom} from "../store/atoms/userDetailsAtom";
import { userModeSelector } from "../store/selectors/userModeSelector";

const Navbar = () => {
    const navigate = useNavigate();
    const isUserRegistered = useRecoilValue(userModeSelector);
    const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);
    const [profilePic, setProfilePic] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [toggle, setToggle] = useState(false);
    const registerToken = Cookies.get("registerToken"); // jwt
    const googleToken = Cookies.get("googleToken"); // jwt
    const localAuthObj = localStorage.getItem("localAuthObj"); // obj
    const localAuthToken = Cookies.get("localAuthToken"); // t/f
    // const isUserRegistered = Cookies.get("isUserRegistered"); // t/f
    const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;
    console.log("DOMAIN_NAME: ", DOMAIN_NAME);

    // assume only one can be present
    const registered = isUserRegistered || localAuthToken;
    const token = isUserRegistered || localAuthObj;
    // console.log("token", token);
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
        Cookies.remove("registerToken", { path : "/", domain:DOMAIN_NAME });
        Cookies.remove("googleToken",  {path: "/", domain:DOMAIN_NAME });
        Cookies.remove("localAuthToken", { path: "/", domain:DOMAIN_NAME });
        Cookies.remove("isUserRegistered", {path:"/", domain:DOMAIN_NAME });
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

    // useEffect(() => {
    //     window.onscroll = () => {

    //     }
    // })

    return (
    <div className="sticky top-0 backdrop-blur z-20">
        <div className="font-Satoshi flex justify-around md:text-xl text-xs sm:text-md w-[90vw] m-auto backdrop-blur-xl z-30 items-center">
            <div className="w-[40%] border">
                <div className="cursor-pointer md:text-2xl font-semibold my-2 w-fit bg-[#354EAD] rounded-full" onClick={() => navigate('/')}>
                    <img src="https://res.cloudinary.com/dubrgx4b1/image/upload/v1740262048/devploy-logo-transparent_e4r1mz.png" alt="Devploy" className="md:h-[40px] h-[15px] sm:h-[25px]"/>
                </div>
            </div>
            <div className="flex md:justify-between justify-end items-center text-gray-700 border">
                <div className="md:mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/builds')}>
                    Builds
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="md:mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/environment')}>
                    Dashboard
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className={`mx-3 p-1 ${profilePic ? "cursor-pointer" : ""}`}>
            {email ?
                (
                // <div className="relative group">
                //     <div
                //     className = {
                //         `relative rounded-full md:w-[40px] md:h-[40px] sm:w-[25px] sm:h-[25px] w-[20px] h-[20px] ${profilePic ? "border-2 hover:border-white bg-violet-300" : ""} bg-contain bg-no-repeat bg-center grayscale hover:grayscale-0 hover:scale-150 hover:translate-y-6 hover:transition-all z-30 group-hover:z-40 group-has-[:nth-child(2):hover]:grayscale-0 group-has-[:nth-child(2):hover]:scale-150 group-has-[:nth-child(2):hover]:translate-y-6 shadow-lg`} style={{ backgroundImage: `url(${profilePic})`}} onClick={() => setToggle(t => !t)}
                //     ></div>
                //     {(
                //         <div className="opacity-0 transform scale-75 pointer-events-none transition-all duration-300 ease-in-out absolute md:top-[60px] right-[-9vw] translate-x-[-20px] grid rounded-md md:text-base text-xs text-gray-700 font-medium border md:w-[18vw] z-30 group-hover:z-10 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto peer">
                //             <span className="md:p-1 text-center text-[8px] h-auto flex flex-col whitespace-normal break-all bg-gray-300/70 hover:bg-gray-300 rounded-md m-1">
                //                 {email}
                //             </span>
                //             <span className="mini-dashboard" onClick={logoutFun}>Logout</span>
                //             <span className="mini-dashboard">Reset Password</span>
                //             <span className="mini-dashboard">Delete Account</span>
                //         </div>)
                //     }
                // </div>
                <div className="relative group border border-black">
                    {/* Profile Picture */}
                    <div
                        className={`
                            relative rounded-full 
                            md:w-[40px] md:h-[40px] sm:w-[30px] sm:h-[30px] w-[25px] h-[25px] 
                            ${profilePic ? "border-2 hover:border-white bg-violet-300" : ""} 
                            bg-contain bg-no-repeat bg-center grayscale hover:grayscale-0 
                            hover:scale-110 sm:hover:scale-125 md:hover:scale-150 
                            hover:translate-y-2 md:hover:translate-y-6 
                            transition-all duration-200 z-30 group-hover:z-40 shadow-lg
                            group-has-[:nth-child(2):hover]:grayscale-0 
                            group-has-[:nth-child(2):hover]:scale-150 
                            group-has-[:nth-child(2):hover]:translate-y-6
                        `}
                        style={{ backgroundImage: `url(${profilePic})` }}
                        onClick={() => setToggle((t) => !t)}
                    ></div>
                
                    {/* Dropdown Menu */}
                    <div
                        className="
                            opacity-0 transform scale-90 pointer-events-none transition-all duration-300 
                            ease-in-out absolute top-full right-0 md:top-[60px] md:right-[-9vw] md:translate-x-[-20px] 
                            md:w-[18vw] sm:w-40 w-32 
                            bg-white rounded-md shadow-lg border z-30 
                            group-hover:z-10 group-hover:opacity-100 group-hover:scale-100 
                            group-hover:pointer-events-auto
                            border border-black grid
                            text-xs sm:text-sm md:text-base"
                    >
                        <span className="p-2 text-center text-gray-700 font-medium block bg-gray-300/70 hover:bg-gray-300 rounded-md m-1 break-all">
                            {email}
                        </span>
                        <span className="mini-dashboard" onClick={logoutFun}>Logout</span>
                        <span className="mini-dashboard">Reset Password</span>
                        <span className="mini-dashboard">Delete Account</span>
                    </div>
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
    </div>
    )
}
export default Navbar;

