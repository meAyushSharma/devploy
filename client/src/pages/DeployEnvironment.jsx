import { lazy, useEffect } from "react";
import { useRecoilValue } from "recoil";
import ActiveTerminals from "../components/ActiveTerminals";
import { openTerminalsAtom } from "../store/atoms/openTerminalsAtom";
import { userModeSelector } from "../store/selectors/userModeSelector";
const ActiveServicesDashboard = lazy(() => import("../components/ActiveServicesDashboard"));

const DeployEnvironment = () => {
    const isUserRegistered = useRecoilValue(userModeSelector);
    const openTerminals = useRecoilValue(openTerminalsAtom);
    return (isUserRegistered ?
        (<div className="grid font-Satoshi">
            <ActiveServicesDashboard/>
            {openTerminals.length > 0 && (
                <div className="md:m-10 sm:m-5 m-2">
                    <div className="md:text-3xl sm:text-xl text-lg font-semibold text-gray-700">Active Terminals: </div>
                    {openTerminals.map((terminal, key) => <ActiveTerminals key={key} terminal={terminal} index={key+1}/>)}
                </div>
            )}
        </div>) :
        (<div className="font-Satoshi h-[40vh] grid place-content-center">
            <div className="w-fit m-auto bg-gray-700 text-white hover:text-white hover:bg-gray-950 rounded-lg px-4 p-1 font-bold text-xl animate-bounce cursor-pointer shadow-2xl" onClick={() => navigate("/builds")}>
                    Register your email for deployment
            </div>
        </div>)
    )
}

export default DeployEnvironment;