import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "../common/Button";
import TextInput from "../common/TextInput";
import { localSignupFun } from "../../helper/localSignupFun";
import { localLoginFun } from "../../helper/localLoginFun";
import { profilePicUrls } from "../../utils/profilePicUrls";
import { useAlert } from "../../hooks/useAlert";
import { clearStorageHelper } from "../../helper/clearStorageHelper";

const GuestMode = ({setLocalAuth, category}) => {
    const type = category === "Signup";
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
    const FRONTEND_DOMAIN = import.meta.env.VITE_FRONTEND_DOMAIN;
    const navigate = useNavigate();

    const {showAlert} = useAlert();
    
    const [username, setUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");

    const [showPics, setShowPics] = useState(false);
    const [choosenPic, setChoosenPic] = useState(0);

    const profilePics = {
      1: { backgroundImage: `url(${profilePicUrls[1]})` },
      2: { backgroundImage: `url(${profilePicUrls[2]})` },
      3: { backgroundImage: `url(${profilePicUrls[3]})` },
      4: { backgroundImage: `url(${profilePicUrls[4]})` },
      5: { backgroundImage: `url(${profilePicUrls[5]})` },
      6: { backgroundImage: `url(${profilePicUrls[6]})` },
      7: { backgroundImage: `url(${profilePicUrls[7]})` },
      8: { backgroundImage: `url(${profilePicUrls[8]})` },
      9: { backgroundImage: `url(${profilePicUrls[9]})` },
      10: { backgroundImage: `url(${profilePicUrls[10]})` },
      11: { backgroundImage: `url(${profilePicUrls[11]})` },
      12: { backgroundImage: `url(${profilePicUrls[12]})` },
    };

    const RenderProfilePic = () => {
      return choosenPic == 0 ? (
        <div className="whitespace-nowrap sm:text-sm text-xs font-medium text-violet-700">
          {"(づ￣ 3￣)づ"}
        </div>
      ) : (
        <div
          className={`sm:w-[7vw] sm:h-[7vw] w-[15vw] h-[15vw] rounded-full bg-contain bg-no-repeat bg-center border-4 border-violet-300`}
          style={profilePics[choosenPic]}
        ></div>
      );
    };

    const authFun = async () => {
      if(type) {
        // guest = signup mode
        if(username.trim() && localPassword.trim()){
          const success = localSignupFun({ username:username.trim(), localPassword:localPassword.trim(), setLocalAuth, choosenPic: profilePicUrls[choosenPic==0 ? 7 : choosenPic] });
          if(success){
                /* 1. reset values */
                  setUsername("");
                  setLocalPassword("");
                  setChoosenPic(0);
                /* 2. clear previous cookies */
                  Cookies.remove("registerToken", { path : "/", domain:BACKEND_DOMAIN });
                  Cookies.remove("googleToken",  {path: "/", domain:BACKEND_DOMAIN });
                  Cookies.remove("isUserRegistered", {path:"/", domain:BACKEND_DOMAIN });
                /* 3. creating/ensuring directory exists */
                  const createDirectory = async () => {
                    const worker = new Worker(new URL('../../worker/createDirectory.js', import.meta.url));
                    worker.postMessage({});
                    worker.onmessage = e => {
                      worker.terminate();
                      if(e.data.success) console.log("successfully created directory structure");
                      else console.error("error occured during opfs directory structure creation: ", e.data.error);
                    }
                  }
                  await createDirectory();
                /* 4. clearing previous directory */
                const clearDirectory = async () => {
                  const clearStorageObj = await clearStorageHelper({workerPath: "../worker/clearOpfsStorage.js"});
                    if(clearStorageObj?.data?.success) console.log("cleared opfs storage")
                    else console.error("Some error occured during clearing of opfs storage: ", clearStorageObj.data)
                }
                await clearDirectory();

                /* 5. Set Cookies and alert */
                Cookies.set("localAuthToken", "true", {expires: 7, path: "/", domain: FRONTEND_DOMAIN });
                console.log("successfully saved localAuthData!");
                showAlert("Guest user successfully registered (～￣▽￣)～", "success");
                navigate("/");

          } 
          else if(success === "userExist") showAlert("User is already using guest mode", "info")
          else showAlert("Error during guest user registration <(＿　＿)>", "error")
        }
      }


      else {
          // guest = login mode
          if(username && localPassword){
            const obj = localLoginFun({ username:username.trim(), password: localPassword.trim() })
            if(obj.success){
                /* 1. reset values */
                  setUsername("");
                  setLocalPassword("");
                /* 2. clear previous cookies */
                  Cookies.remove("registerToken", { path : "/", domain:BACKEND_DOMAIN });
                  Cookies.remove("googleToken",  {path: "/", domain:BACKEND_DOMAIN });
                  Cookies.remove("isUserRegistered", {path:"/", domain:BACKEND_DOMAIN });
                /* 3. creating/ensuring directory exists */
                  const createDirectory = async () => {
                    const worker = new Worker(new URL('../../worker/createDirectory.js', import.meta.url));
                    worker.postMessage({});
                    worker.onmessage = e => {
                      worker.terminate();
                      if(e.data.success) console.log("successfully created directory structure");
                      else console.error("error occured during opfs directory structure creation: ", e.data.error);
                    }
                  }
                  await createDirectory();
                /* 4. Set Cookies and alert */
                Cookies.set("localAuthToken", "true", { expires:7, path: "/", domain: FRONTEND_DOMAIN });
                showAlert("Guest user logged in successfully (づ￣ 3￣)づ", "success");
                navigate("/");

            }
            
            else {
              if(obj.redirect != "no"){
                showAlert("Failed to log user in (┬┬﹏┬┬)", "error");
                navigate(obj.redirect);
              }else{
                // alert of cause
                showAlert("Failed to log user in (┬┬﹏┬┬)", "error");
              }
            }
        }
      }
    }

    return (
      <div className="px-2">
        {type && <div className="grid sm:mb-4 mb-2">
          <div className="text-gray-800 font-medium my-2">
            Choose an avatar :{" "}
          </div>
          <div className="m-auto">
            <div
              className="sm:w-[7vw] sm:h-[7vw] w-[15vw] h-[15vw] rounded-full bg-violet-300 grid place-content-center text-2xl text-violet-500 cursor-pointer border-4 border-violet-300"
              onClick={() => setShowPics((state) => !state)}
            >
              <RenderProfilePic />
            </div>
          </div>
        </div>}
        {type && showPics && (
          <div className="flex flex-wrap justify-center my-2 border-2 border-violet-500 rounded-lg p-1">
            {Array.from({ length: 12 }).map((_, key) => (
              <div
                className={`sm:w-[7vw] sm:h-[7vw] w-[15vw] h-[15vw] cursor-pointer bg-contain bg-no-repeat bg-center bg-violet-500 m-1 rounded-full border-4 border-violet-500 hover:border-violet-700`}
                key={key}
                style={profilePics[key+1]}
                onClick={(e) => setChoosenPic(key + 1)}
              ></div>
            ))}
          </div>
        )}
        <div>
          <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
            <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
              <label htmlFor="username">Username<span className="text-rose-500">*</span></label>
              {":"}
            </div>
            <TextInput>
              <input
                type="text"
                placeholder="ragnarok666(～￣▽￣)～"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-1 rounded-lg text-black placeholder-gray-700"
              />
            </TextInput>
          </div>
          <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
            <div className="flex items-center sm:justify-between sm:text-base text-sm font-medium text-gray-700">
              <label htmlFor="localPassword">Password<span className="text-rose-500">*</span></label>
              {":"}
            </div>
            <TextInput>
              <input
                type="text"
                placeholder="randomPass666"
                id="localPassword"
                value={localPassword}
                onChange={(e) => setLocalPassword(e.target.value)}
                className="w-full p-1 rounded-lg text-black placeholder-gray-700"
              />
            </TextInput>
          </div>
          <div
            className="sm:mt-4 mt-2"
            onClick={authFun}
          >
            <Button>{category}</Button>
          </div>
        </div>
      </div>
    );
};

export default GuestMode;
