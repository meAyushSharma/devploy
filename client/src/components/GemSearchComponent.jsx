import { useSetRecoilState } from "recoil";
import { BasePackageSearchComponent } from "./BasePackageSearchComponent";
import { gemLibsAtom } from "../store/atoms/libAtoms/gemLibsAtom";

export const GemSearchComponent = () => {
    const setGemLibs = useSetRecoilState(gemLibsAtom);
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
};