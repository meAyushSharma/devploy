import { useRecoilValue } from "recoil";
import { netValidAtom } from "../../store/atoms/networkAtoms/netValidAtom";
import { selectedDriverAtom } from "../../store/atoms/networkAtoms/selectedDriverAtom";
import { lazy, memo } from "react";

const Ports = lazy(() => import("./Ports"))
const ShowPorts = lazy(() => import("./ShowPorts"))
const DriverOption = lazy(() => import("./DriverOption"))
const Bridge = lazy(() => import("./drivers/Bridge"))
const VlanDrivers = lazy(() => import("./drivers/VlanDrivers"))
const HostAndNone = lazy(() => import("./drivers/HostAndNone"))

const NetworkConfig = memo(({type}) =>  {
    const show = useRecoilValue(netValidAtom(type));
    const driver = useRecoilValue(selectedDriverAtom(type));
    const renderDriver = (driver) => {
        switch(driver) {
            case "bridge":
                return <Bridge type={type}/>
            case "ipvlan":
            case "macvlan":
                return <VlanDrivers vlan={driver} type={type}/>
            case "host":
            case "none":
                return <HostAndNone network={driver}/>
            default :
                return <div>Choose wrong driver</div>
        }
    }
    return show && <div>
        <div className="border-2 border-violet-500/50 hover:border-violet-500/100 rounded-lg p-2 mb-4">
            <Ports type={type}/>
            <ShowPorts type={type}/>
        </div>
        <div className="border-2 border-violet-500/50 hover:border-violet-500/100 rounded-lg p-2 mb-4">
            <DriverOption type={type}/>
            {driver && renderDriver(driver)}
        </div>
    </div>
})

export default NetworkConfig;