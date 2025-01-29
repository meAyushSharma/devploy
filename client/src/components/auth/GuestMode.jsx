import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "../common/Button";
import TextInput from "../common/TextInput";
import { localSignupFun } from "../../helper/localSignupFun";
import { localLoginFun } from "../../helper/localLoginFun";
import { profilePicUrls } from "../../utils/profilePicUrls";

const GuestMode = ({setLocalAuth, category}) => {
    const type = category === "Signup";
    const navigate = useNavigate();
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
      <div className="whitespace-nowrap text-sm font-medium text-violet-700">
        {"(づ￣ 3￣)づ"}
      </div>
    ) : (
      <div
        className={`w-[7vw] h-[7vw] rounded-full bg-contain bg-no-repeat bg-center border-4 border-violet-300`}
        style={profilePics[choosenPic]}
      ></div>
    );
  };

  const authFun = () => {
    if(type) {
      // guest = signup mode
      if(username && localPassword){
        const success = localSignupFun({ username:username.trim(), localPassword:localPassword.trim(), setLocalAuth, choosenPic: profilePicUrls[choosenPic==0 ? 7 : choosenPic] });
        if(success){
            setUsername("");
            setLocalPassword("");
            setChoosenPic(0);
            Cookies.set("localAuthToken", "true", {expires: 7, path: "/"});
            console.log("successfully saved localAuthData!");
            navigate("/")
        }else {
            // alert user of failure;
        }
      }
    }else {
        // guest = login mode
        if(username && localPassword){
          const obj = localLoginFun({ username:username.trim(), password: localPassword.trim() })
          if(obj.success){
            setUsername("");
            setLocalPassword("");
            Cookies.set("localAuthToken", "true", {expires:7, path: "/" });
            navigate("/")
          }else{
            if(obj.redirect != "no"){
              navigate(obj.redirect);
            }else{
            // alert of cause
            }
          }
      }
    }
  }

  return (
    <div className="px-2">
      {type && <div className="grid mb-4">
        <div className="text-gray-800 font-medium my-2">
          Choose an avatar :{" "}
        </div>
        <div className="m-auto">
          <div
            className="w-[7vw] h-[7vw] rounded-full bg-violet-300 grid place-content-center text-2xl text-violet-500 cursor-pointer border-4 border-violet-300"
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
              className={`w-[7vw] h-[7vw] cursor-pointer bg-contain bg-no-repeat bg-center bg-violet-500 m-1 rounded-full border-4 border-violet-500 hover:border-violet-700`}
              key={key}
              style={profilePics[key+1]}
              onClick={(e) => setChoosenPic(key + 1)}
            ></div>
          ))}
        </div>
      )}
      <div>
        <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
          <div className="flex items-center justify-between text-lg font-medium text-gray-700">
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
          <div className="flex items-center justify-between text-lg font-medium text-gray-700">
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
          className="mt-4"
          onClick={authFun}
        >
          <Button>{category}</Button>
        </div>
      </div>
    </div>
  );
};
export default GuestMode;
