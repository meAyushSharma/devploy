import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { alertState } from "../store/atoms/alertAtom";
import { IoIosCloseCircle } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { BiSolidError } from "react-icons/bi";
import { PiSealWarningFill } from "react-icons/pi";
import { IoTerminal } from "react-icons/io5";
const Alert = () => {
    const [alert, setAlert] = useRecoilState(alertState);
    const [visible, setVisible] = useState(false);
    let time = 3000;
    if(alert.type === "error"){
        time = 150000;
    }
    useEffect(() => {
      if (alert.visible) {
        setVisible(true);
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(() => setAlert({ ...alert, visible: false }), 300);
        }, time);
        return () => clearTimeout(timer);
      }
    }, [alert, setAlert]);
  
    if (!alert.visible) return null;
  
    const alertStyles = {
      warning: "bg-gray-800 border-white border-dashed text-white",
      success: "bg-violet-600 border-white border-dashed text-white",
      info: "bg-yellow-100 border-yellow-400 border-dashed text-yellow-700",
      error: "bg-red-100 border-red-400 border-dashed text-red-700",
      terminal:"bg-gray-950 border-slate-200 border-dashed text-white"
    };

    const renderIcon = () => {
        switch(alert.type) {
            case "info":
                return <FaInfoCircle className="md:text-lg sm:text-md text-sm"/>;
            case "success":
                return <SiTicktick className="md:text-lg sm:text-md text-sm"/>;
            case "error":
                return <BiSolidError className="md:text-lg sm:text-md text-sm"/>;
            case "warning":
                return <PiSealWarningFill className="md:text-lg sm:text-md text-sm"/>;
            case "terminal":
                return <IoTerminal className="md:text-lg sm:text-md text-sm"/>
        }
    }
  
    return (
      <div
        className={
          `fixed top-[18vh] left-1/2 transform -translate-x-1/2
           -translate-y-1/2 md:p-3 sm:p-2 p-1 rounded-full
            border-b-2 shadow-md transition-all
             duration-300 font-Satoshi z-2 md:text-lg text-sm
             ${
          visible ? "opacity-100 scale-100 z-10" : "opacity-0 scale-90"
        } ${alertStyles[alert.type]}`}
      >
        <div className="flex items-center justify-between gap-2">
            {renderIcon()}
            <span className="font-medium grid items-center md:text-lg sm:text-md text-xs">
                {alert.message}
            </span>
          <button onClick={() => setVisible(false)} className="ml-2 md:text-lg sm:text-md text-sm font-bold p-1">
            <IoIosCloseCircle />
          </button>
        </div>
      </div>
    );
  };

export default Alert;