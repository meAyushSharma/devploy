import { lazy, memo } from "react";

const  CargoSearchComponent = lazy(() => import("./CargoSearchComponent"));
const  GemSearchComponent = lazy(() => import("./GemSearchComponent"));
const  NpmSearchComponent = lazy(() => import("./NpmSearchComponent"));
const  PipSearchComponent = lazy(() => import("./PipSearchComponent"));

const RenderPackageManager = memo(({pmValue, whatType}) => {
    switch(pmValue){
        case "npm":
            return <NpmSearchComponent key={pmValue} type={whatType}/>
        case "pip":
            return <PipSearchComponent key={pmValue} type={whatType}/>
        case "cargo":
            return <CargoSearchComponent key={pmValue} type={whatType}/>
        case "gem":
            return <GemSearchComponent key={pmValue} type={whatType}/>
        default :
            return <div key={pmValue}>Wrong package manager chosen</div>;             
    }
})

export default RenderPackageManager;