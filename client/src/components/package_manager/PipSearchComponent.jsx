import { useSetRecoilState } from "recoil";
import { pipLibsAtom } from "../../store/atoms/libAtoms/pipLibsAtom";
import { memo } from "react";
import  BasePackageSearchComponent  from "./BasePackageSearchComponent";

const PipSearchComponent = memo(({type}) => {
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

export default PipSearchComponent;