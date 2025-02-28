import { lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie";
const ShowSavedFiles = lazy(() => import("../components/ShowSavedFiles"));

import { FaBrain } from "react-icons/fa6";
import { FaOctopusDeploy } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { userModeSelector } from "../store/selectors/userModeSelector";

const Builds = () => {
    const navigate = useNavigate();
    const isUserLoggedIn = useRecoilValue(userModeSelector);
    const isGuestLoggedIn = Cookies.get("localAuthToken") === "true"; // local
    useEffect(() => {
        if(!(isGuestLoggedIn || isUserLoggedIn)) navigate("/signup");
    }, [isGuestLoggedIn, navigate, isUserLoggedIn])

    return ( (isGuestLoggedIn || isUserLoggedIn) &&
    <div className="font-Satoshi bg-soft-white md:mx-6 sm:mx-4 mx-2">
        <div className="grid grid-rows-2 gap-3 md:m-4 m-1 sm:m-2 text-[#232223]">
            <div className="flex md:flex-row flex-col min-h-[40vh] md:m-4 m-1 sm:m-2">
                <div className="md:p-4 p-1 sm:p-2">
                    <div 
                    className="
                    md:text-5xl text-base sm:text-3xl
                    font-bold text-gray-500 my-6
                    ">
                        Code. Customize. Deploy. Seamlessly with the power of AI in your DevBox environment.
                    </div>
                    <div className="grid items-center grid-cols-[2fr_1fr] md:gap-2 gap-1">
                            <div className="flex items-center justify-center md:p-4 p-1 sm:p-2 bg-violet-500 text-white font-medium md:text-xl text-xs sm:text-xl rounded-md cursor-pointer h-fit hover:bg-violet-600" onClick={()=> navigate('/create-env') }>
                                    Create Custom Environment
                            </div>
                            <div className="flex gap-2 items-center justify-center md:p-4 p-1 sm:p-2 bg-violet-500 hover:bg-violet-600 text-white font-medium md:text-xl text-xs sm:text-xl rounded-md cursor-pointer" onClick={()=> navigate('/ask-devai')}>
                                    <FaBrain />
                                    Ask DevAì
                            </div>
                    </div>
                </div>
                <div className="cursor-pointer flex justify-center">
                    <div className="md:w-[40vw] md:h-[40vh] w-[80vw] h-[60vw] my-2 bg-[url('./assets/docker_whale.png')] bg-contain bg-center bg-no-repeat border rounded-lg text-lg text-gray-500 relative group scale-100 hover:scale-105 hover:border-2 hover:shadow transition-all ease-in-out">
                    <div className="absolute inset-0 group-hover:backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"></div>
                    <div className="relative p-2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all grid text-gray-800 md:text-sm text-xs"> 
                        <span>$docker -t build my-environment .</span>
                        <span>$ docker run -d -p 8080:80 my-environment</span>
                        <span>$ docker ps</span>
                        <span>$ docker exec -it container_id bash</span>
                        <span>$ docker-compose down</span>
                        <span>$ docker-compose up</span>
                    </div>
                    </div>
                </div>
            </div>

            <div className="flex md:flex-row flex-col min-h-[40vh] md:m-4 m-1 sm:m-2">
                <div className="cursor-pointer flex justify-center md:mr-5 mr-0">
                    <div className="md:w-[45vw] md:h-[40vh] w-[80vw] h-[60vw] bg-[url('./assets/element_leo_transparent.png')] bg-cover bg-center bg-no-repeat border rounded-lg text-lg text-gray-500 relative group scale-100 hover:scale-105 hover:border-2 hover:shadow transition-all ease-in-out">
                        <div className="absolute inset-0 group-hover:backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"></div>
                        <div className="relative p-2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all grid text-gray-800 md:text-sm text-xs"> 
                            <span>$ docker-compose up</span>
                            <span>$ docker-compose down</span>
                            <span>$ docker-compose logs -f</span>
                            <span>$ docker-compose up --build</span>
                            <span>$ docker-compose ps</span>
                            <span>$ docker-compose stop</span>
                        </div>
                    </div>
                </div>
                <div className="md:p-4 p-1 sm:p-2 grid justify-items-center md:justify-items-start">
                    <div className="md:text-5xl text-base sm:text-3xl font-bold text-gray-500 md:my-6 my-4">
                        Define. Orchestrate. Simplify. Effortless setups with Docker Compose in DevBox.
                    </div>
                    <div className="flex items-center gap-2 md:p-4 p-1 sm:p-2 bg-violet-500 hover:bg-violet-600 text-white font-medium md:text-xl text-xs sm:text-xl rounded-md w-fit cursor-pointer my-2" onClick={()=> navigate('/docker-compose') }>
                        <FaOctopusDeploy />
                        Create docker compose
                    </div>
                </div>
            </div>

        </div>
        <div className="">
            <ShowSavedFiles/>
        </div>
    </div>)
}

export default Builds;