import { useSetRecoilState } from "recoil";
import { BasePackageSearchComponent } from "./BasePackageSearchComponent";
import { gemLibsAtom } from "../../store/atoms/libAtoms/gemLibsAtom";
import { memo } from "react";

export const GemSearchComponent = memo(({type}) => {
    const setGemLibs = useSetRecoilState(gemLibsAtom(type));
    return (
        <BasePackageSearchComponent
            label="gem packages"
            requestFor="gem"
            transformData={(data) => {
                data.map(ele => ({
                    label:`Name : ${ele.name} || ${ele.version} || Info : ${ele.info}`,
                    value: ele.name
                }));
            }}
            setGlobalState={setGemLibs}
        />
    );
})