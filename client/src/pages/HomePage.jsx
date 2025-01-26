import { useEffect, useState } from "react";
import { PiArrowCircleRightThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [i, setI] = useState(0);
    const [randomColor, setRandomColor] = useState(0);
    const navigate = useNavigate();
    const words = ["Code", "Scripts", "Ideas", "Solutions", "Innovation", "Builds", "Workflows"];
    const colors = ["bg-[#ff8957]", "bg-[#3be999]", "bg-[#ffcf00]", "bg-[#c698fe]", "bg-[#81bdf8]", "bg-[#ff6f61]", "bg-[#4caf50]"];
    const hoverColors = ["hover:bg-[#ff8957]", "hover:bg-[#3be999]", "hover:bg-[#ffcf00]", "hover:bg-[#c698fe]", "hover:bg-[#81bdf8]", "hover:bg-[#ff6f61]", "hover:bg-[#4caf50]"];
    useEffect(() => {
        const timeout = setInterval(() => {
            setI(i => (i+1)%7);
            setRandomColor(Math.floor((Math.random()*10+1)%7));
        }, 2300)
        return () => clearInterval(timeout)
    }, [])

    return (
<div className="min-h-[100vh] font-Satoshi text-[#111] bg-white grid mx-[5vw]">
    <div className="h-[90vh] flex items-center">
        <div className="text-7xl font-[400]">
            <div className="my-4">
                <span>Your</span>
                <span className={`${colors[randomColor]} rounded-lg p-1 mx-4`}>{words[i]}</span>
            </div>
            <span> Engineered for Excellence.</span>
            <div className={`rounded-full border border-black w-fit mt-8 ${hoverColors[(randomColor+1)%7]} hover:border-transparent group`}>
                <div className="text-xl flex items-center cursor-pointer" onClick={() => navigate("/builds")}>
                    <span><PiArrowCircleRightThin className="text-6xl group-hover:bg-white rounded-full"/></span>
                    <span className="font-medium mr-4 ml-2 group-hover:text-[#111]">/builds</span>
                </div>
            </div>
        </div>
    </div>
    <div className="text-4xl font-[400] my-8">
        We simplify development workflows with services like Docker image creation, workflow automation, software testing, and seamless deployment. Our scalable solutions empower teams to achieve efficiency, reliability, and focus on delivering exceptional products.
    </div>
    <div>
        
    </div>
</div>
    )
}


export default HomePage;