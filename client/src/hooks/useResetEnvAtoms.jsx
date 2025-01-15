import { useRecoilCallback } from "recoil"
import { envValidAtom } from "../store/atoms/envAtoms/envValidAtom"
import { envVariablesAtom } from "../store/atoms/envAtoms/envVariablesAtom"
import { cargoLibsAtom } from "../store/atoms/libAtoms/cargoLibsAtom"
import { gemLibsAtom } from "../store/atoms/libAtoms/gemLibsAtom"
import { npmLibsAtom } from "../store/atoms/libAtoms/npmLibsAtom"
import { pipLibsAtom } from "../store/atoms/libAtoms/pipLibsAtom"
import { selectedPackageManagerAtom } from "../store/atoms/libAtoms/selectedPackageManagerAtom"
import { bridgeAtom } from "../store/atoms/networkAtoms/bridgeAtom"
import { ipvlanAtom } from "../store/atoms/networkAtoms/ipvlanAtom"
import { macvlanAtom } from "../store/atoms/networkAtoms/macvlanAtom"
import { netValidAtom } from "../store/atoms/networkAtoms/netValidAtom"
import { portAtom } from "../store/atoms/networkAtoms/portsAtom"
import { selectedDriverAtom } from "../store/atoms/networkAtoms/selectedDriverAtom"
import { projectNameAtom } from "../store/atoms/projectNameAtom"
import { selectedDatabaseAtom } from "../store/atoms/softwareAtoms/selectedDatabaseAtom"
import { selectedOsAtom } from "../store/atoms/softwareAtoms/selectedOsAtom"
import { selectedRuntimeAtom } from "../store/atoms/softwareAtoms/selectedRuntimeAtom"
import { testDockerfileAtom } from "../store/atoms/testDockerfileAtom"

export const useResetEnvAtoms = () => useRecoilCallback(({reset}) => () => {
        reset(bridgeAtom("env"))
        reset(ipvlanAtom("env"))
        reset(macvlanAtom("env"))
        reset(portAtom("env"))
        reset(selectedDriverAtom("env"))
        reset(netValidAtom("env"))
        reset(envValidAtom("env"))
        reset(envVariablesAtom("env"))
        reset(npmLibsAtom("env"))
        reset(pipLibsAtom("env"))
        reset(selectedPackageManagerAtom("env"))
        reset(cargoLibsAtom("env"))
        reset(gemLibsAtom("env"))
        reset(selectedDatabaseAtom("env"))
        reset(selectedOsAtom("env"))
        reset(selectedRuntimeAtom("env"))
        reset(testDockerfileAtom("env"))
        reset(projectNameAtom("env"))
})