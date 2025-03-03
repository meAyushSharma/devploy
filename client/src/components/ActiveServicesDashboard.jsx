import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { envDeployDetails } from "../store/atoms/envDeployDetails";
import { useGetActiveContainers } from "../hooks/useGetActiveContainers";
import Timer from "./Timer";
import { FiLoader } from "react-icons/fi";
import { GrServices } from "react-icons/gr";
import Button from "./common/Button";
import { useTerminateService } from "../hooks/useTerminateService";
import { openTerminalsAtom } from "../store/atoms/openTerminalsAtom";
import { useAlert } from "../hooks/useAlert";

const ActiveServicesDashboard = () => {
    const navigate = useNavigate();
    const {showAlert} = useAlert();
    const deployDetails = useRecoilValue(envDeployDetails);
    const { fetchContainers, errorGettingContainers, isGettingConts, getConts } = useGetActiveContainers();
    const { terminateService, isTerminating, errorTerminating, success } = useTerminateService();
    const setOpenTerminals = useSetRecoilState(openTerminalsAtom);

    useEffect(() => {success && showAlert("Terminated active service (づ￣ 3￣)づ", "terminal")}, [success]);
    useEffect(() => {getConts && showAlert("Fetched active services (づ￣ 3￣)づ", "terminal")}, [getConts]);

    useEffect(() => {
        fetchContainers();
    }, [])

    useEffect(() => {errorTerminating && showAlert("Error terminating service (┬┬﹏┬┬)", "error")}, [errorTerminating]);
    useEffect(() => {errorGettingContainers && showAlert("Error fetching active services (┬┬﹏┬┬)", "error")}, [errorGettingContainers]);

    const openTerminal = ({contId, contDockerId, containerName, envName}) => {
        // console.log(deployDetails);
        const environment = deployDetails.filter(env => env[0]===envName);
        if(environment){
            const cont = environment[0][1].filter(contDetails => contDetails.containerId === contId);
            if(cont){
                setOpenTerminals(state => [...state, { contId, contDockerId, containerName}]);
            }
        }
    }


    return (
        <div className={`md:m-10 sm:m-10 mx-2 grid ${deployDetails.length > 0 ? "":"h-[70vh]"}`}>
                <div className="flex w-full justify-between">
                    <div className="md:text-3xl sm:text-xl text-md font-semibold text-gray-700">Active Services:</div>
                    <button onClick={fetchContainers} className="bg-gray-800 w-fit h-fit text-white p-1 sm:p-2 md:px-4 sm:px-2 rounded-full font-medium hover:bg-gray-950 flex items-center gap-2">
                        <span className="text-xs md:text-lg sm:text-base">Get Active Services</span><GrServices className={`${isGettingConts ? "animate-spin":""}`}/>
                    </button>
                </div>
                {deployDetails.length > 0 && deployDetails.map((envServices, key) => (
                    <div className="grid" key={key}>
                        <div className="md:text-xl sm:text-md text-base text-gray-800 font-medium mt-4 mb-2">
                            {key+1}. Environment: {envServices[0]}
                        </div>
                        <table className="table-auto border-2 border-gray-950/60 rounded border-separate border-spacing-x-3 border-spacing-y-1 text-xs md:text-base sm:text-sm">
                            <thead className="h-fit">
                            <tr>
                                <th className="table-head">Sr.</th>
                                <th className="table-head">Service</th>
                                <th className="table-head">Port</th>
                                <th className="table-head">Live</th>
                                <th className="table-head">Time Left</th>
                                <th className="table-head">Terminal</th>
                                <th className="table-head">Kill service</th>
                            </tr>
                            </thead>
                            <tbody>
                            {envServices[1].map((serviceDetails, serviceKey) => (
                                <tr key={serviceKey}>
                                    <td className="text-center p-1 rounded border">
                                        {serviceKey+1}. 
                                    </td>
                                    <td className="rounded border">
                                        <span className="hover:bg-gray-300/60 px-2 underline text-gray-700 font-medium rounded">{serviceDetails.containerName}</span>
                                    </td>
                                    <td className="text-center rounded font-medium text-gray-700 border">
                                        {serviceDetails.urls.map((url, portKey) => <div key={portKey}>{url.port}</div>)}
                                    </td>
                                    <td className="rounded grid border">
                                        {serviceDetails.urls.map((url, urlKey) => <a href={url.url} target="_blank" key={urlKey} className="text-gray-800 font-medium hover:text-violet-900 hover:bg-violet-300/60 px-2 rounded whitespace-nowrap">{url.urlName}</a>)}
                                    </td>
                                    <td className="rounded text-center border whitespace-nowrap">
                                        <Timer createdTime={serviceDetails.created_at} recallFun={fetchContainers}/>
                                    </td>
                                    <td className="text-center rounded">
                                        <button className="dashboard-btn" onClick={() => openTerminal({contId: serviceDetails.containerId, contDockerId: serviceDetails.contDockerId, containerName: serviceDetails.containerName, envName:serviceDetails.envName})}>
                                            Open Terminal
                                        </button>
                                    </td>
                                    <td className="text-center rounded">
                                        <button className="dashboard-btn" onClick={() => terminateService({imgId: serviceDetails.imageId, imgDockerId: serviceDetails.imgDockerId, contDockerId: serviceDetails.contDockerId, contId: serviceDetails.containerId})}>    
                                                {isTerminating ? <FiLoader className="animate-spin"/>: "End Service"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}
                {deployDetails.length == 0 && (
                    <div className="bg-gray-300 text-gray-700 hover:bg-violet-500 hover:text-white h-[40vh] w-full my-5 rounded-full grid grid-rows-3 p-2 text-center">
    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        <span className="md:text-7xl text-2xl sm:text-3xl font-bold hidden md:block">Devbox</span>
        <span className="md:text-6xl text-xl sm:text-2xl font-bold hidden sm:block">Devbox</span>
        <span className="md:text-5xl text-lg sm:text-xl font-bold hidden sm:block">Devbox</span>
        <span className="md:text-4xl text-md sm:text-lg font-bold">Devbox</span>
        <span className="md:text-3xl text-sm sm:text-base font-bold">Devbox</span>
        <span className="md:text-2xl text-xs sm:text-md font-bold">Devbox</span>
    </div>
    <span className="w-fit m-auto bg-gray-700 text-white hover:text-white hover:bg-violet-950 rounded-lg px-4 p-1 font-bold text-xl animate-bounce cursor-pointer shadow-2xl" onClick={() => navigate("/builds")}>
        /build-anew
    </span>
    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        <span className="md:text-2xl text-xs sm:text-md font-bold">Devbox</span>
        <span className="md:text-3xl text-sm sm:text-base font-bold">Devbox</span>
        <span className="md:text-4xl text-md sm:text-lg font-bold">Devbox</span>
        <span className="md:text-5xl text-lg sm:text-xl font-bold hidden sm:block">Devbox</span>
        <span className="md:text-6xl text-xl sm:text-2xl font-bold hidden sm:block">Devbox</span>
        <span className="md:text-7xl text-2xl sm:text-3xl font-bold hidden md:block">Devbox</span>
    </div>
</div>

                )}
        </div>
    )
}

export default ActiveServicesDashboard;