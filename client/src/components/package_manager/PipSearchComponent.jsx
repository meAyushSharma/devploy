import { useSetRecoilState } from "recoil";
import { BasePackageSearchComponent } from "./BasePackageSearchComponent";
import { pipLibsAtom } from "../../store/atoms/libAtoms/pipLibsAtom";
import { memo } from "react";

export const PipSearchComponent = memo(({type}) => {
    const setPipLibs = useSetRecoilState(pipLibsAtom(type));
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
})