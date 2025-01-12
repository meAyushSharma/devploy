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

export const getDockerfileFamily = selectorFamily({
    key:"getDockerfileFamily",
    get: id => ({get}) => {
        const os = get(selectedOsAtom(id)); //[]
        const runtime = get(selectedRuntimeAtom(id)); //[]
        const database = get(selectedDatabaseAtom(id)); //[]

        const packageManager = get(selectedPackageManagerAtom(id)); //[{value, label},...]
        const npm = get(npmLibsAtom(id)); //[]
        const pip = get(pipLibsAtom(id));
        const cargo = get(cargoLibsAtom(id));
        const gem = get(gemLibsAtom(id));

        const ports = get(portAtom(id)); //[{host:hostPort, container:contPort}]

        return {
            os:os,
            runtimes:runtime,
            databases:database,
            packageManagers:packageManager,
            npm:npm,
            pip:pip,
            cargo:cargo,
            gem:gem,
            ports:ports
        }
    }
})