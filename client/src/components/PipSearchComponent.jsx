import { useSetRecoilState } from "recoil";
import { BasePackageSearchComponent } from "./BasePackageSearchComponent";
import { pipLibsAtom } from "../store/atoms/libAtoms/pipLibsAtom";

export const PipSearchComponent = () => {
    const setPipLibs = useSetRecoilState(pipLibsAtom);
    return (
        <BasePackageSearchComponent
            label="pip packages"
            requestFor="pip"
            transformData={(data) => {
                if (data.message === "Not Found") return [];
                return [{label: `Name: ${data.info.name}, Version: ${data.info.version}`, value: data.info.name}];
            }}
            setGlobalState={setPipLibs}
        />
    );
};