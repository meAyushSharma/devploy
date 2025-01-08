import { useSetRecoilState } from "recoil";
import { BasePackageSearchComponent } from "./BasePackageSearchComponent";
import { npmLibsAtom } from "../../store/atoms/libAtoms/npmLibsAtom";

export const NpmSearchComponent = () => {
    const setNpmLibs = useSetRecoilState(npmLibsAtom);
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
};