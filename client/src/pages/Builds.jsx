import { useNavigate } from "react-router-dom"
import { ShowSavedFiles } from "../components/ShowSavedFiles"
import { AiOutlineDocker } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa6";

export const Builds = () => {
    // bg-[#e8e9e8]
    // text-[#1b1b19]
    const navigate = useNavigate();
    return <div className="font-Satoshi bg-soft-white mx-6">

        <div className="grid grid-rows-3 gap-3 m-4 text-[#232223]">
            <div className="flex flex-row min-h-[40vh] m-4">
                <div className="p-4">
                    <div className="text-5xl font-bold text-gray-500 my-6">Code. Customize. Deploy. Seamlessly with the power of AI in your DevBox environment.</div>
                    <div className="flex border gap-3">
                            <div className="flex items-center bg-violet-500 hover:bg-violet-600 pl-3 text-white font-medium text-xl rounded-md w-fit cursor-pointer my-2">
                                <span  onClick={()=> navigate('/create-env') } className="hover:bg-violet-800 py-1 rounded px-1">Create Custom Environment</span>
                                <span className="max-w-[15%] flex flex-col justify-center items-center px-2 ml-3 hover:bg-violet-800 mr-1 rounded-md">
                                    <AiOutlineDocker className="text-3xl border-b-2"/>
                                    <FaAngleDown  className="hover:bg-violet-950 text-xl w-[100%] rounded"/>
                                </span>
                            </div>
                            <div className="bg-violet-500 hover:bg-violet-600 p-3 text-white font-medium text-xl rounded-md w-fit cursor-pointer my-2" onClick={()=> navigate('/create-env') }>Explore Environment Templates</div>
                    </div>
                </div>
                <div className="">
                    <div className="w-[40vw] h-[40vh] bg-[url('./assets/docker_whale.png')] bg-contain bg-center bg-no-repeat border text-lg hover:bg-[url('./assets/docker_whale_masked.png')]">$docker -d build .</div>
                </div>
            </div>

            <div className="flex flex-row min-h-[40vh] m-4">
                <div>
                    <div className="w-[45vw] h-[40vh] bg-[url('./assets/element_leo_transparent.png')] bg-cover bg-center bg-no-repeat"></div>
                </div>
                <div>
                    <div className="text-5xl font-bold text-gray-500 my-6">Define. Orchestrate. Simplify. Effortless setups with Docker Compose in DevBox.</div>
                    <div className="bg-violet-500 hover:bg-violet-600 p-3 text-white font-medium text-xl rounded-md w-fit cursor-pointer my-2" onClick={()=> navigate('/docker-compose') }>Create docker compose</div>
                </div>
            </div>

            <div className="flex w-full min-h-[40vh] m-4">
                <div className="p-4">
                    <div className="text-5xl font-bold text-gray-500 my-6">Package. Isolate. Run. Streamline your applications with containerization in DevBox.</div>
                        <div className="bg-violet-500 hover:bg-violet-600 p-3 text-white font-medium text-xl rounded-md w-fit cursor-pointer my-2" onClick={()=> navigate('/create-project') }>Containerize Your Application</div>
                </div>
                <div>
                    <div className="w-[35vw] h-[50vh] bg-[url('./assets/cube_single.png')] bg-contain bg-left bg-no-repeat border-2 mx-2"></div>
                </div>
            </div>
        </div>
        <div className="">
            <ShowSavedFiles/>
        </div>
    </div>
}