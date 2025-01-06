import { useSetRecoilState } from "recoil";
import { BasePackageSearchComponent } from "./BasePackageSearchComponent";
import { cargoLibsAtom } from "../store/atoms/libAtoms/cargoLibsAtom";

export const CargoSearchComponent = () => {
    const setCargoLibs = useSetRecoilState(cargoLibsAtom);
    return (
        <BasePackageSearchComponent
            label="cargo packages"
            requestFor="cargo"
            transformData={(data) => {
                return data.crates.map(ele => ({
                    label:`Name : ${ele.id} || ${ele.description}`,
                    value: ele.id
                }))
            }}
            setGlobalState={setCargoLibs}
        />
    );
};