import  CargoSearchComponent from "./CargoSearchComponent"
import  GemSearchComponent from "./GemSearchComponent"
import  NpmSearchComponent from "./NpmSearchComponent"
import  PipSearchComponent from "./PipSearchComponent"

const RenderPackageManager = (pmValue, whatType) => {
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
}

export default RenderPackageManager;