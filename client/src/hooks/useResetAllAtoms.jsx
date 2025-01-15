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
import { serviceCountAtom } from "../store/atoms/serviceCountAtom"
import { serviceDelTrackerAtom } from "../store/atoms/serviceDelTrackerAtom"
import { selectedDatabaseAtom } from "../store/atoms/softwareAtoms/selectedDatabaseAtom"
import { selectedOsAtom } from "../store/atoms/softwareAtoms/selectedOsAtom"
import { selectedRuntimeAtom } from "../store/atoms/softwareAtoms/selectedRuntimeAtom"
import { testDockerfileAtom } from "../store/atoms/testDockerfileAtom"

export const useResetAllAtoms = n => useRecoilCallback(({ reset }) => () => {
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
    reset(serviceCountAtom)
    reset(serviceDelTrackerAtom)
    Array.from({ length: n }).forEach((_, key) => {
        reset(bridgeAtom(`service${key + 1}`))
        reset(ipvlanAtom(`service${key + 1}`))
        reset(macvlanAtom(`service${key + 1}`))
        reset(portAtom(`service${key + 1}`))
        reset(selectedDriverAtom(`service${key + 1}`))
        reset(netValidAtom(`service${key + 1}`))
        reset(envValidAtom(`service${key + 1}`))
        reset(envVariablesAtom(`service${key + 1}`))
        reset(npmLibsAtom(`service${key + 1}`))
        reset(pipLibsAtom(`service${key + 1}`))
        reset(selectedPackageManagerAtom(`service${key + 1}`))
        reset(cargoLibsAtom(`service${key + 1}`))
        reset(gemLibsAtom(`service${key + 1}`))
        reset(selectedDatabaseAtom(`service${key + 1}`))
        reset(selectedOsAtom(`service${key + 1}`))
        reset(selectedRuntimeAtom(`service${key + 1}`))
        reset(testDockerfileAtom(`service${key + 1}`))
        reset(projectNameAtom(`service${key + 1}`))
    })
})