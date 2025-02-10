import { lazy, useEffect } from "react";
import ActiveTerminals from "../components/ActiveTerminals";
const ActiveServicesDashboard = lazy(() => import("../components/ActiveServicesDashboard"));

const DeployEnvironment = () => {
    return (
        <div className="grid font-Satoshi">
            <ActiveServicesDashboard/>
            <ActiveTerminals/>
        </div>
    )
}

export default DeployEnvironment;