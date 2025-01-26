import { useState } from "react";
import Button from "../common/Button";
import TextInput from "../common/TextInput";
import { localSignupFun } from "../../helper/localSignupFun";
import { redirect, useNavigate } from "react-router-dom";
import { localLoginFun } from "../../helper/localLoginFun";

const GuestMode = ({setLocalAuth, category}) => {
    const type = category === "Signup";
  const [username, setUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  const [showPics, setShowPics] = useState(false);
  const [choosenPic, setChoosenPic] = useState(0);

  const profilePics = {
    1: "bg-[url('./assets/p1.png')]",
    2: "bg-[url('./assets/p2.png')]",
    3: "bg-[url('./assets/p3.png')]",
    4: "bg-[url('./assets/p4.png')]",
    5: "bg-[url('./assets/p5.png')]",
    6: "bg-[url('./assets/p6.png')]",
    7: "bg-[url('./assets/p7.png')]",
    8: "bg-[url('./assets/p8.png')]",
    9: "bg-[url('./assets/p9.png')]",
    10: "bg-[url('./assets/p10.png')]",
    11: "bg-[url('./assets/p11.png')]",
    12: "bg-[url('./assets/p12.png')]",
  };

  const RenderProfilePic = () => {
    return choosenPic == 0 ? (
      <div className="whitespace-nowrap text-sm font-medium text-violet-700">
        {"(づ￣ 3￣)づ"}
      </div>
    ) : (
      <div
        className={`w-[7vw] h-[7vw] rounded-full ${profilePics[choosenPic]} bg-contain bg-no-repeat bg-center border-4 border-violet-300`}
      ></div>
    );
  };

  const authFun = () => {
    if(type) {
      //signup fun
      if(username && localPassword){
        const success = localSignupFun({ username, localPassword, setLocalAuth, choosenPic });
        if(success){
            setUsername("");
            setLocalPassword("");
            setChoosenPic(0);
            console.log("successfully saved localAuthData!");
            redirect("/")
        }else {
            // alert user of failure;
        }
      }
    }else {
        // login fun
        if(username && localPassword){
          const obj = localLoginFun({ username, password: localPassword })
          if(obj.success){
            setUsername("");
            setLocalPassword("");
            redirect("/")
          }else{
            if(obj.redirect != "no"){
              redirect(obj.redirect);
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
              className={`w-[7vw] h-[7vw] cursor-pointer ${
                profilePics[key + 1]
              } bg-contain bg-no-repeat bg-center bg-violet-500 m-1 rounded-full border-4 border-violet-500 hover:border-violet-700`}
              key={key}
              onClick={(e) => setChoosenPic(key + 1)}
            ></div>
          ))}
        </div>
      )}
      <div>
        <div className="grid md:grid-cols-[1fr_3fr] gap-2 my-2">
          <div className="flex items-center justify-between text-lg font-medium text-gray-700">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="localPassword">Password</label>
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
