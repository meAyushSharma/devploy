import { lazy, useEffect } from "react";
import ActiveTerminals from "../components/ActiveTerminals";
import { useRecoilValue } from "recoil";
import { openTerminalsAtom } from "../store/atoms/openTerminalsAtom";
import { useAlert } from "../hooks/useAlert";
const ActiveServicesDashboard = lazy(() => import("../components/ActiveServicesDashboard"));

const DeployEnvironment = () => {
    const openTerminals = useRecoilValue(openTerminalsAtom);
    return (
        <div className="grid font-Satoshi">
            <ActiveServicesDashboard/>
            {openTerminals.length > 0 && (
                <div className="md:m-10 sm:m-5 m-2">
                    <div className="md:text-3xl sm:text-xl text-lg font-semibold text-gray-700">Active Terminals: </div>
                    {openTerminals.map((terminal, key) => <ActiveTerminals key={key} terminal={terminal} index={key+1}/>)}
                </div>
            )}
        </div>
    )
}

export default DeployEnvironment;