import { useSetRecoilState } from "recoil";
import { npmLibsAtom } from "../../store/atoms/libAtoms/npmLibsAtom";
import { memo } from "react";
import  BasePackageSearchComponent from "./BasePackageSearchComponent";

const NpmSearchComponent = memo(({type}) => {
    const setNpmLibs = useSetRecoilState(npmLibsAtom(type));
    return (
        <BasePackageSearchComponent
            label="npm packages"
            requestFor="npm"
            transformData={(data) =>
                 data.objects.map((ele) => ({
                    label: `Name: ${ele.package.name}, Description: ${ele.package.description}`,
                    value: ele.package.name,
                }))
            }
            setGlobalState={setNpmLibs}
        />
    );
})

export default NpmSearchComponent;