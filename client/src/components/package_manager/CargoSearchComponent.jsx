import { useSetRecoilState } from "recoil";
import { cargoLibsAtom } from "../../store/atoms/libAtoms/cargoLibsAtom";
import { lazy, memo } from "react";
const BasePackageSearchComponent = lazy(() => import("./BasePackageSearchComponent"))

const CargoSearchComponent = memo(({type}) => {
    const setCargoLibs = useSetRecoilState(cargoLibsAtom(type));
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
})

export default CargoSearchComponent;