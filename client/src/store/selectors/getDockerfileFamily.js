import { selectorFamily } from "recoil";
import { selectedOsAtom } from "../atoms/softwareAtoms/selectedOsAtom";
import { selectedRuntimeAtom } from "../atoms/softwareAtoms/selectedRuntimeAtom";
import { selectedDatabaseAtom } from "../atoms/softwareAtoms/selectedDatabaseAtom";
import { selectedPackageManagerAtom } from "../atoms/libAtoms/selectedPackageManagerAtom";
import { npmLibsAtom } from "../atoms/libAtoms/npmLibsAtom";
import { pipLibsAtom } from "../atoms/libAtoms/pipLibsAtom";
import { cargoLibsAtom } from "../atoms/libAtoms/cargoLibsAtom";
import { gemLibsAtom } from "../atoms/libAtoms/gemLibsAtom";
import { portAtom } from "../atoms/networkAtoms/portsAtom";
import { projectNameAtom } from "../atoms/projectNameAtom";
import { selectedDriverAtom } from "../atoms/networkAtoms/selectedDriverAtom";
import { bridgeAtom } from "../atoms/networkAtoms/bridgeAtom";
import { ipvlanAtom } from "../atoms/networkAtoms/ipvlanAtom";
import { macvlanAtom } from "../atoms/networkAtoms/macvlanAtom";

export const getDockerfileFamily = selectorFamily({
    key:"getDockerfileFamily",
    get: id => ({get}) => {
        const os = get(selectedOsAtom(id)); //[]
        const runtimes = get(selectedRuntimeAtom(id)); //[]
        const databases = get(selectedDatabaseAtom(id)); //[]

        const packageManagers = get(selectedPackageManagerAtom(id)); //[{value, label},...]
        const npm = get(npmLibsAtom(id)); //[]
        const pip = get(pipLibsAtom(id));
        const cargo = get(cargoLibsAtom(id));
        const gem = get(gemLibsAtom(id));

        const ports = get(portAtom(id)); //[{host:hostPort, container:contPort}]
        const driver = get(selectedDriverAtom(id)); // "bridge", "host" etc
        const bridge = get(bridgeAtom(id)); // "network-name"
        const ipvlan = get(ipvlanAtom(id)); //mode:"", pairs:[], parent:"", name:""
        const macvlan = get(macvlanAtom(id)); // same as above

        const name = get(projectNameAtom(id));

        return {
            os,
            runtimes,
            databases,
            packageManagers,
            npm,
            pip,
            cargo,
            gem,
            ports,
            driver,
            bridge,
            ipvlan,
            macvlan,
            name
        }
    }
})