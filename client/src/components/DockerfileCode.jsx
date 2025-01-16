import { memo } from "react";
import { FormattedCode } from "./FormattedCode";

export const DockerfileCode = memo(({dockerfile, delFun}) => {
    // dockerfile is not sent directly beacuse we can show other details here as well
    return (
    <div className="my-4">
       <FormattedCode code={dockerfile.dockerfile} delFun={delFun ? delFun : ""}/>
    </div>
    );
});