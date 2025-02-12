import { lazy, useEffect } from "react";
import ActiveTerminals from "../components/ActiveTerminals";
import { useRecoilValue } from "recoil";
import { openTerminalsAtom } from "../store/atoms/openTerminalsAtom";
const ActiveServicesDashboard = lazy(() => import("../components/ActiveServicesDashboard"));

const DeployEnvironment = () => {
    const openTerminals = useRecoilValue(openTerminalsAtom);
    return (
        <div className="grid font-Satoshi">
            <ActiveServicesDashboard/>
            {openTerminals.length > 0 && (
                <div className="m-10">
                    <div className="text-3xl font-semibold text-gray-700">Active Terminals: </div>
                    {openTerminals.map((terminal, key) => <ActiveTerminals key={key} terminal={terminal}/>)}
                </div>
            )}
        </div>
    )
}

export default DeployEnvironment;