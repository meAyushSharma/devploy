import { lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const ShowSavedFiles = lazy(() => import("../components/ShowSavedFiles"));

import { FaBrain } from "react-icons/fa6";
import { FaOctopusDeploy } from "react-icons/fa";
import { LuContainer } from "react-icons/lu";

const Builds = () => {
    const navigate = useNavigate();
    const isGuestLoggedIn = Cookies.get("localAuthToken") === "true"; // local
    const isUserLoggedIn =  Cookies.get("isUserRegistered") === "true"; // server
    useEffect(() => {
        if(!(isGuestLoggedIn || isUserLoggedIn)) navigate("/signup");
    }, [isGuestLoggedIn, navigate, isUserLoggedIn])

    return ( (isGuestLoggedIn || isUserLoggedIn) &&
    <div className="font-Satoshi bg-soft-white mx-6">
        <div className="grid grid-rows-3 gap-3 m-4 text-[#232223]">
            <div className="flex flex-row min-h-[40vh] m-4">
                <div className="p-4">
                    <div className="text-5xl font-bold text-gray-500 my-6">Code. Customize. Deploy. Seamlessly with the power of AI in your DevBox environment.</div>
                    <div className="flex border items-center justify-between">
                            <div className="flex items-center p-2 bg-violet-500 text-white font-medium text-xl rounded-md cursor-pointer h-fit">
                                <span  onClick={()=> navigate('/create-env') } className="bg-violet-700/80 hover:bg-violet-800 p-2 rounded mr-1">
                                    Create Custom Environment
                                </span>
                                <span  onClick={()=> navigate('/ask-devai') } className="bg-violet-700/80 hover:bg-violet-800 p-2 rounded ml-1">
                                    Checkout Templates
                                </span>
                                {/* <span className="max-w-[15%] flex flex-col justify-center items-center px-2 ml-3 hover:bg-violet-800 mr-1 rounded-md my-[3px]">
                                    <AiOutlineDocker className="text-3xl border-b-2"/>
                                    <FaAngleDown  className="text-xl w-[100%] rounded"/>
                                </span> */}
                            </div>
                            <div className="flex gap-2 items-center p-4 bg-violet-500 hover:bg-violet-600 text-white font-medium text-xl rounded-md cursor-pointer" onClick={()=> navigate('/ask-devai')}>
                                    <FaBrain />
                                    Ask DevAì
                            </div>
                    </div>
                </div>
                <div className="cursor-pointer">
                    <div className="w-[40vw] h-[40vh] bg-[url('./assets/docker_whale.png')] bg-contain bg-center bg-no-repeat border rounded-lg text-lg text-gray-500 relative group scale-100 hover:scale-105 hover:border-2 hover:shadow transition-all ease-in-out">
                    <div className="absolute inset-0 group-hover:backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"></div>
                    <div className="relative p-2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all grid text-gray-800 text-sm"> 
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

            <div className="flex flex-row min-h-[40vh] m-4">
                <div className="cursor-pointer mr-5">
                    <div className="w-[45vw] h-[40vh] bg-[url('./assets/element_leo_transparent.png')] bg-cover bg-center bg-no-repeat border rounded-lg text-lg text-gray-500 relative group scale-100 hover:scale-105 hover:border-2 hover:shadow transition-all ease-in-out">
                        <div className="absolute inset-0 group-hover:backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"></div>
                        <div className="relative p-2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all grid text-gray-800 text-sm"> 
                            <span>$ docker-compose up</span>
                            <span>$ docker-compose down</span>
                            <span>$ docker-compose logs -f</span>
                            <span>$ docker-compose up --build</span>
                            <span>$ docker-compose ps</span>
                            <span>$ docker-compose stop</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-5xl font-bold text-gray-500 my-6">Define. Orchestrate. Simplify. Effortless setups with Docker Compose in DevBox.</div>
                    <div className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 p-3 text-white font-medium text-xl rounded-md w-fit cursor-pointer my-2" onClick={()=> navigate('/docker-compose') }>
                        <FaOctopusDeploy />
                        Create docker compose
                    </div>
                </div>
            </div>

            <div className="flex w-full min-h-[40vh] m-4">
                <div className="p-4">
                    <div className="text-5xl font-bold text-gray-500 my-6">Package. Isolate. Run. Streamline your applications with containerization in DevBox.</div>
                        <div className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 p-3 text-white font-medium text-xl rounded-md w-fit cursor-pointer my-2" onClick={()=> navigate('/create-project') }>
                        <LuContainer />
                        Containerize Your Application
                    </div>
                </div>
                <div className="cursor-pointer mr-5">
                    <div className="w-[35vw] h-[50vh] bg-[url('./assets/cube_single.png')] bg-contain bg-left bg-no-repeat border-2 mx-2 border rounded-lg text-lg text-gray-500 relative group scale-100 hover:scale-105 hover:border-2 hover:shadow transition-all ease-in-out">
                        <div className="absolute inset-0 group-hover:backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"></div>
                        <div className="relative p-2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all grid text-gray-800 text-sm"> 
                            <span>$ docker run --name my-container -d -p 8080:80 nginx:latest</span>
                            <span>$ docker-compose down</span>
                            <span>{"$ docker inspect --format='{{json .State}}' container_id"}</span>
                            <span>{"$ docker cp ./local-file.txt container_id:/app/local-file.txt"}</span>
                            <span>$ docker run -it ubuntu:latest /bin/bash</span>
                            <span>$ docker restart container_id && docker logs -f container_id</span>
                        </div>
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