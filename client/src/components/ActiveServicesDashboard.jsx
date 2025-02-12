import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { envDeployDetails } from "../store/atoms/envDeployDetails";
import { useGetActiveContainers } from "../hooks/useGetActiveContainers";
import Timer from "./Timer";
import { FiLoader } from "react-icons/fi";
import Button from "./common/Button";
import { useTerminateService } from "../hooks/useTerminateService";
import { openTerminalsAtom } from "../store/atoms/openTerminalsAtom";

const ActiveServicesDashboard = () => {
    const navigate = useNavigate();
    const deployDetails = useRecoilValue(envDeployDetails);
    const { fetchContainers } = useGetActiveContainers();
    const { terminateService, isTerminating, errorTerminating, success } = useTerminateService();
    const setOpenTerminals = useSetRecoilState(openTerminalsAtom);
    useEffect(() => {
        fetchContainers();
    }, []);
    useEffect(() => {
        fetchContainers();
    }, [success]);
    const openTerminal = ({contId, contDockerId, containerName, envName}) => {
        // console.log(deployDetails);
        const environment = deployDetails.filter(env => env[0]===envName);
        if(environment){
            const cont = environment[0][1].filter(contDetails => contDetails.containerId === contId);
            console.log(cont)
            if(cont){
                setOpenTerminals(state => [...state, { contId, contDockerId, containerName}]);
            }
        }
    }


    return (
        <div className="m-10">
            <div className="">
                <div className="flex w-full justify-between">
                    <div className="text-3xl font-semibold text-gray-700">Active Services:</div>
                    <button onClick={fetchContainers} className="bg-gray-600 w-fit text-white p-1 px-4 rounded-full font-medium hover:bg-gray-700">Get Active Containers</button>
                </div>
                {deployDetails.length > 0 && deployDetails.map((envServices, key) => (
                    <div className="grid" key={key}>
                        <div className="text-xl text-gray-800 font-medium mt-4 mb-2">
                            {key+1}. Environment: {envServices[0]}
                        </div>
                        <table className="table-auto border-2 border-violet-500/60 rounded border-separate border-spacing-x-3 border-spacing-y-1">
                            <thead>
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
                                        {serviceDetails.urls.map((url, urlKey) => <a href={url.url} target="_blank" key={urlKey} className="text-gray-800 font-medium hover:text-violet-900 hover:bg-violet-300/60 px-2 rounded">{url.urlName}</a>)}
                                    </td>
                                    <td className="rounded text-center border">
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
                    <div className="bg-gray-300 text-gray-700 hover:bg-violet-500 hover:text-white h-[40vh] w-full my-5 rounded-full grid grid-rows-3 p-2">
                        <span className="text-center">
                            <span className="text-7xl font-bold mx-4">Devbox</span>
                            <span className="text-6xl font-bold mx-4">Devbox</span>
                            <span className="text-5xl font-bold mx-4">Devbox</span>
                            <span className="text-4xl font-bold mx-4">Devbox</span>
                            <span className="text-3xl font-bold mx-4">Devbox</span>
                            <span className="text-2xl font-bold mx-4">Devbox</span>
                        </span>
                        <span className="w-fit m-auto bg-gray-700 text-white hover:text-white hover:bg-violet-950 rounded-lg px-4 p-1 font-bold text-xl animate-bounce cursor-pointer shadow-2xl" onClick={() => navigate("/builds")}>/build-anew</span>
                        <span className="text-center">
                            <span className="text-2xl font-bold mx-4">Devbox</span>
                            <span className="text-3xl font-bold mx-4">Devbox</span>
                            <span className="text-4xl font-bold mx-4">Devbox</span>
                            <span className="text-5xl font-bold mx-4">Devbox</span>
                            <span className="text-6xl font-bold mx-4">Devbox</span>
                            <span className="text-7xl font-bold mx-4">Devbox</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActiveServicesDashboard;