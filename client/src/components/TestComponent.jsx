import { useRecoilValue } from "recoil"
import { softwareSelector } from "../store/selectors/softwareSelector"
import { memo } from "react";


export const TestComponent = memo(() => {
    const softwares = useRecoilValue(softwareSelector);
    return (
        <>
            <p>These are the selected softwares:</p>
        </>
    );
})