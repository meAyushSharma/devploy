import { useSetRecoilState } from "recoil";
import { gemLibsAtom } from "../../store/atoms/libAtoms/gemLibsAtom";
import { lazy, memo } from "react";
const BasePackageSearchComponent = lazy(() => import("./BasePackageSearchComponent"))

const GemSearchComponent = memo(({type}) => {
    const setGemLibs = useSetRecoilState(gemLibsAtom(type));
    return (
        <BasePackageSearchComponent
            label="gem packages"
            requestFor="gem"
            transformData={(data) => {
                return data.map(ele => ({
                    label:`Name : ${ele.name} || ${ele.version} || Info : ${ele.info}`,
                    value: `${ele.name}`
                }));
            }}
            setGlobalState={setGemLibs}
        />
    );
})

export default GemSearchComponent;