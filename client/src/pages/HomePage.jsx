import { lazy, useEffect, useState } from "react";
import { PiArrowCircleRightThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { LuExternalLink } from "react-icons/lu";
import { FaChevronDown , FaChevronUp } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
const Footer = lazy(() => import("../components/Footer"));

const HomePage = () => {
    const [i, setI] = useState(0);
    const [randomColor, setRandomColor] = useState(0);
    const [expandPm, setExpandPm] = useState(false);
    const [expandNet, setExpandNet] = useState(false);
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
        <div className="font-Satoshi">
            <div className="min-h-[100vh] text-[#111] bg-white grid md:mx-[5vw] mx-[3vw]">
                <div className="h-[90vh] flex items-center">
                    <div className="md:text-7xl sm:text-4xl font-[400] text-2xl">
                        <div className="md:my-4">
                            <span>Your</span>
                            <span className={`${colors[randomColor]} rounded-lg p-1 md:mx-4 sm:mx-2 mx-1`}>{words[i]}</span>
                        </div>
                        <span> Engineered for Excellence.</span>
                        <div className={`rounded-full border border-black w-fit mt-8 ${hoverColors[(randomColor+1)%7]} hover:border-transparent group`}>
                            <div className="md:text-xl text-lg sm:text-md flex items-center cursor-pointer" onClick={() => navigate("/builds")}>
                                <span><PiArrowCircleRightThin className="md:text-6xl text-2xl sm:text-4xl group-hover:bg-white rounded-full"/></span>
                                <span className="font-medium mr-4 ml-2 group-hover:text-[#111]">/builds</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:text-4xl sm:text-2xl text-md font-[400] my-8">
                    We simplify <span className="homepage-underline decoration-rose-500 hover:bg-rose-500">development workflows</span> with services like <span className="homepage-underline decoration-indigo-500 hover:bg-indigo-500">Docker image creation</span>, <span className="homepage-underline decoration-yellow-500 hover:bg-yellow-500">workflow automation</span>, <span className="homepage-underline decoration-orange-500 hover:bg-orange-500">software testing</span>, and <span className="homepage-underline decoration-lime-500 hover:bg-lime-500">seamless deployment</span>. Our scalable solutions empower teams to achieve efficiency, reliability, and focus on delivering exceptional products.
                </div>
                <div className="mb-20">
                    <div className="md:text-5xl text-2xl sm:text-3xl font-medium text-gray-800 my-8">
                        Services:
                    </div>
                    <div className="md:h-[60vh] h-[90vh]">
                        <div className="md:text-3xl text-xl sm:text-2xl cursor-pointer group bg-[#c698fe] rounded-lg p-2">
                            <div>
                                <div className="md:mx-2 mx-1">1. Configurations</div>
                                <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-500 ease-in-out md:text-2xl text-sm sm:text-xl md:mx-10 mx-2 sm:mx-4 group-hover:my-4">
                                    Generate well-structured and professional <span className="homepage-underline hover:bg-white decoration-white hover:text-black">custom configuration files for Docker</span>, seamlessly integrating <span className="homepage-underline hover:bg-white decoration-white hover:text-black">multiple registries</span>, including <span className="homepage-underline hover:bg-white decoration-white hover:text-black">Docker Hub</span>, <span className="homepage-underline hover:bg-white decoration-white hover:text-black">Node Package Manager (NPM)</span>, <span className="homepage-underline hover:bg-white decoration-white hover:text-black">Python Package Index (PyPI)</span>, <span className="homepage-underline hover:bg-white decoration-white hover:text-black">Cargo (Rust) registry</span>, and <span className="homepage-underline hover:bg-white decoration-white hover:text-black">RubyGems</span>. These configurations ensure efficient package management, authentication, and streamlined workflows for developers working across different ecosystems.
                                </div>
                            </div>
                        </div>

                        <div className="md:text-3xl text-xl sm:text-2xl cursor-pointer group mt-4 bg-yellow-100 rounded-lg p-2">
                            <div>
                                <div className="md:mx-2 mx-1">2. Environment Deployment</div>
                                <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-500 ease-in-out md:text-2xl text-sm sm:text-xl md:mx-10 mx-2 sm:mx-4 group-hover:my-4">
                                Effortlessly <span className="homepage-underline decoration-yellow-300 hover:text-black hover:bg-yellow-300 hover:text-black">deploy your environments</span>, gain seamless <span className="homepage-underline decoration-yellow-300 hover:text-black hover:bg-yellow-300 hover:text-black">terminal access</span> for interaction, <span className="homepage-underline decoration-yellow-300 hover:text-black hover:bg-yellow-300 hover:text-black">run essential services</span> with ease, and make them accessible <span className="homepage-underline decoration-yellow-300 hover:text-black hover:bg-yellow-300 hover:text-black">live on the internet</span> for real-time usage.
                                </div>
                            </div>
                        </div>
                        <div className="md:text-3xl text-xl sm:text-2xl cursor-pointer group mt-4 bg-red-100 rounded-lg p-2">
                            <div>
                                <div className="md:mx-2 mx-1 flex items-center gap-2">3. AI Support : DevAì <LuExternalLink className="hidden group-hover:block text-2xl" onClick={() => navigate("/ask-devai")}/></div>
                                <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-500 ease-in-out md:text-2xl text-sm sm:text-xl md:mx-10 mx-2 sm:mx-4 group-hover:my-4">
                                <span className="homepage-underline decoration-pink-500 hover:bg-pink-500">Ask DevAì</span> all your questions about <span className="homepage-underline decoration-pink-500 hover:bg-pink-500">Docker and Dockerfile configurations</span>  and get expert insights instantly.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4">
                        <div className="md:text-5xl text-lg sm:text-3xl font-medium text-gray-800 group flex items-center md:gap-4 gap-2 border">
                            <span className="border">Create Custom Environment: </span><LuExternalLink className="hidden group-hover:block md:text-5xl text-2xl sm:text-3xl cursor-pointer" onClick={() => navigate("/create-env")}/>
                        </div>
                        <div className="md:text-2xl text-sm sm:text-xl md:mx-4 mx-2 grid gap-6 mb-20">
                            <div className="">
                            Build fully customized environments with everything in one place, seamlessly integrating major package registries and leveraging Docker images with specific tags. Ensure a smooth, efficient, and well-structured development experience tailored to your needs.
                            </div>
                            <div className="">
                                <div className="font-medium my-2 text-gray-800">1. Registry integration : <span className="text-gray-700">Images, Package Managers and Dependencies</span></div>
                                <div className="md:mx-6 mx-2 sm:mx-4">
                                    <div className="md:text-lg text-sm sm:text-md flex justify-between bg-rose-200 items-center p-1 rounded-t-md text-rose-700">
                                        <span>Available package managers:</span>
                                        <span className="cursor-pointer mr-4" onClick={() => setExpandPm(state => !state)}>{expandPm ? <FaChevronUp />:<FaChevronDown />}</span>
                                    </div>
                                    {expandPm && <div className="md:text-lg sm:text-md text-xs pl-6 bg-rose-100 rounded-b-md text-rose-500">
                                        <ul className="list-disc">
                                            <li>Node Package Manage (NPM)</li>
                                            <li>Python Package Index (PyPI)</li>
                                            <li>Cargo registry (Rust)</li>
                                            <li>RubyGems registry (Ruby on rails)</li>
                                        </ul>
                                    </div>}
                                </div>
                                <div className="w-[90%] m-auto my-6">
                                    <img src="https://res.cloudinary.com/dubrgx4b1/image/upload/v1740087953/Screenshot_2025-02-21_030437_w9on5w.png" alt="package-managers.png" />
                                </div>
                            </div>
                            <div className="">
                                <div className="font-medium my-2 text-gray-800">2. Network creation : <span className="text-gray-700">Manage network configurations</span></div>
                                <div className="md:mx-6 mx-2 sm:mx-4">
                                    <div className="md:text-lg text-sm sm:text-md flex justify-between bg-yellow-200 items-center p-1 rounded-t-md text-yellow-700">
                                        <span>Network types:</span>
                                        <span className="cursor-pointer mr-4" onClick={() => setExpandNet(state => !state)}>{expandNet ? <FaChevronUp />:<FaChevronDown />}</span>
                                    </div>
                                    {expandNet && <div className="md:text-lg text-xs sm:text-md pl-6 bg-yellow-100 rounded-b-md text-yellow-700/80">
                                        <ul className="list-disc">
                                            <li>Bridge</li>
                                            <li className="">
                                                <div>IpVLAN</div>
                                                <ul className="list-disc ml-6">
                                                    <li>Layer 2 (default)</li>
                                                    <li>Layer 3</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <div>MacVLAN</div>
                                                <ul className="list-disc ml-6">
                                                    <li>Bridge (default)</li>
                                                    <li>Vepa</li>
                                                    <li>Passthru</li>
                                                    <li>Private</li>
                                                </ul>
                                            </li>
                                            <li>Host</li>
                                            <li>None</li>
                                        </ul>
                                    </div>}
                                </div>
                                <div className="w-[90%] m-auto my-6">
                                    <img src="https://res.cloudinary.com/dubrgx4b1/image/upload/v1740089787/Screenshot_2025-02-21_034426_auqeox.png" alt="network-configs.png" />
                                </div>
                            </div>
                            <div>
                                <div className="group flex gap-2 items-center font-medium my-2 text-gray-800">
                                    <span className="">3. Docker Compose:</span>
                                    <LuExternalLink className="hidden group-hover:block text-2xl cursor-pointer" onClick={() => navigate("/docker-compose")}/>
                                </div>
                                <div className="md:ml-6 sm:ml-4 ml-2">
                                You can effortlessly define and configure multiple services, and the system will automatically generate a well-structured Docker Compose file, ensuring seamless deployment and management of your containerized applications.
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 mb-10">
                            <div className="md:text-5xl text-lg sm:text-3xl font-medium text-gray-800 group flex items-center md:gap-4 gap-2">
                            <div>Deploy Environment: </div><LuExternalLink className="hidden group-hover:block md:text-5xl text-2xl sm:text-3xl cursor-pointer" onClick={() => navigate("/environment")}/>
                            </div>
                            <div className="md:ml-6 md:text-2xl text-sm sm:text-xl md:mx-4 mx-2">
                                <div className="mb-4">
                                You can <span className="homepage-underline decoration-pink-500 hover:bg-pink-500">deploy your custom environment</span> to <span className="homepage-underline decoration-yellow-500 hover:bg-yellow-500">test configurations</span>, <span className="homepage-underline decoration-rose-500 hover:bg-rose-500">run services</span>, or <span className="homepage-underline decoration-violet-500 hover:bg-violet-500">execute tests</span>. For each exposed port, you will receive a unique endpoint that provides <span className="homepage-underline decoration-orange-500 hover:bg-orange-500">live access to the running service</span> on that port. Available <span className="homepage-underline decoration-pink-500 hover:bg-pink-500">for 15 minutes</span>. You get <span className="homepage-underline decoration-pink-500 hover:bg-pink-500">516 MB of RAM</span> for each instance of environment deployed.
                                </div>
                                <div className="">
                                    <div className="font-medium text-gray-800">1. Unique Endpoint:</div>
                                    <div className="mx-6">For each exposed port on your service, you get a unique protected endpoint which points to your service running inside that particular container.
                                    </div>
                                    <div className="w-[96%] m-auto my-6">
                                        <img src="https://res.cloudinary.com/dubrgx4b1/image/upload/v1740096523/Screenshot_2025-02-21_053826_kj8jrd.png" alt="active-services-image.png" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">2. Terminal Access:</div>
                                    <div className="mx-6">Terminal access to your running service.
                                    </div>
                                    <div className="w-[96%] m-auto my-6">
                                        <img src="https://res.cloudinary.com/dubrgx4b1/image/upload/v1740096525/Screenshot_2025-02-21_053755_lzaddy.png" alt="terminal-image.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:gap-4 sm:gap-3 gap-2">
                            <div className="md:md:text-5xl text-lg sm:text-3xl font-medium text-gray-800">
                                Features:
                            </div>
                            <div className="md:text-2xl text-sm sm:text-xl grid md:gap-1">
                                <div className="hover:bg-pink-200 rounded p-1">1. Build professional docker <span className="homepage-underline decoration-pink-500 hover:bg-pink-500">configurations</span>.</div>
                                <div className="hover:bg-indigo-200 rounded p-1">
                                    2. We use <span className="homepage-underline decoration-indigo-500 hover:bg-indigo-500">Origin Private File System</span> to store your configuration files on the browser, which can store from <span className="homepage-underline decoration-indigo-500 hover:bg-indigo-500">10 GB of data to 60% of storage</span> when configured.
                                </div>
                                <div className="hover:bg-yellow-200 rounded p-1">3. Fast data <span className="homepage-underline decoration-yellow-500 hover:bg-yellow-500">retreival</span> and <span className="homepage-underline decoration-yellow-500 hover:bg-yellow-500">storage</span>.</div>
                                <div className="hover:bg-soft-indigo rounded p-1">4. <span className="homepage-underline decoration-violet-500 hover:bg-violet-500">AI support</span> for your queries.</div>
                                <div className="hover:bg-soft-brown rounded p-1">5. <span className="homepage-underline decoration-orange-500 hover:bg-orange-500">Test</span> your environments by <span className="homepage-underline decoration-orange-500 hover:bg-orange-500">deploying them remotely</span>.</div>
                                <div className="hover:bg-soft-green rounded p-1">6. Get <span className="homepage-underline decoration-lime-900 hover:bg-lime-900">terminal access</span> to your <span className="homepage-underline decoration-lime-900 hover:bg-lime-900">running services</span>.</div>
                                <div className="hover:bg-rose-300 rounded p-1">7. <span className="homepage-underline decoration-rose-500 hover:bg-rose-500">Guest Mode</span> is also available for hobyists.</div>
                            </div>
                            <div className="relative inline-flex items-center justify-center gap-4 group w-fit m-auto mb-8 mt-6">
                                <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                                <div className="group relative inline-flex items-center justify-center gap-3 md:text-2xl text-sm rounded-xl bg-gray-900 px-8 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30 cursor-pointer" onClick={() => navigate("/builds")}>
                                    Start building <IoArrowForwardCircleOutline className="-rotate-45 group-hover:rotate-0 md:text-5xl text-2xl sm:text-3xl transition-all font-thin"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}


export default HomePage;