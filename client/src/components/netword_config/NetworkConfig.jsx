import { useRecoilValue } from "recoil";
import { Ports } from "./Ports";
import { ShowPorts } from "./ShowPorts";
import { netValidAtom } from "../../store/atoms/networkAtoms/netValidAtom";
import { DriverOption } from "./DriverOption";
import { selectedDriverAtom } from "../../store/atoms/networkAtoms/selectedDriverAtom";
import { Bridge } from "./drivers/Bridge";
import { Ipvlan } from "./drivers/Ipvlan";

export const NetworkConfig = () =>  {
    const show = useRecoilValue(netValidAtom);
    const driver = useRecoilValue(selectedDriverAtom);
    const renderDriver = (driver) => {
        switch(driver) {
            case "bridge":
                return <Bridge/>
            case "ipvlan":
                return <Ipvlan/>
            case "macvlan":
        }
    }
    return show && <div>
        <Ports/>
        <ShowPorts/>
        <DriverOption/>
        {driver && renderDriver(driver)}
    </div>
}