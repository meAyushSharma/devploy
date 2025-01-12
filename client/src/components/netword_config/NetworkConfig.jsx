import { useRecoilValue } from "recoil";
import { Ports } from "./Ports";
import { ShowPorts } from "./ShowPorts";
import { netValidAtom } from "../../store/atoms/networkAtoms/netValidAtom";
import { DriverOption } from "./DriverOption";
import { selectedDriverAtom } from "../../store/atoms/networkAtoms/selectedDriverAtom";
import { Bridge } from "./drivers/Bridge";
import { VlanDrivers } from "./drivers/VlanDrivers";
import { memo } from "react";

export const NetworkConfig = memo(({type}) =>  {
    const show = useRecoilValue(netValidAtom(type));
    const driver = useRecoilValue(selectedDriverAtom(type));
    const renderDriver = (driver) => {
        switch(driver) {
            case "bridge":
                return <Bridge type={type}/>
            case "ipvlan":
            case "macvlan":
                return <VlanDrivers vlan={driver} type={type}/>
        }
    }
    return show && <div>
        <Ports type={type}/>
        <ShowPorts type={type}/>
        <DriverOption type={type}/>
        {driver && renderDriver(driver)}
    </div>
})