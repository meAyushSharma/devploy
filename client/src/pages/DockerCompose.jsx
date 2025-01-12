import { useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5"
import { useRecoilState, useRecoilValue } from "recoil";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { dockerfileSelector } from "../store/selectors/dockerfileSelector";
import { DockerfileCode } from "../components/DockerfileCode";

export const DockerCompose = () => {
    // obviously type=service
    //* handle project name : project name of docker compose is not global variable, so handle while keeping it in mind
    const [projName, setProjName] = useState("my-project");
    const [isTouched, setIsTouched] = useState(false);
    const handleBlur = () => setIsTouched(true);
    const navigate = useNavigate();
    const dockerfiles = useRecoilValue(dockerfileSelector);
    // handle service deletion
    const [testDockerfile, setTestDockerfile] = useRecoilState()
    const delService = (index) => {

    }
    return (
        <div className="font-Satoshi">
            <div className="flex items-center">
                <span className="text-xl font-medium text-gray-700">Project name : </span>
                <input 
                type="text"
                onBlur={handleBlur}
                onChange={e => setProjName(e.target.value.trim())}
                value={projName}
                className={`border rounded text-lg font-medium px-2 text-center mx-4 ${projName ? 'border-blue-500':'border-rose-500 mx-2'} enabled:hover:border-gray-400`}
                />
                {!projName && isTouched && (
                    <div className="flex gap-1 items-center mr-4">
                        <IoInformationCircleOutline className="text-rose-500"/>
                        <span className="text-rose-500 text-sm">This field is required</span>
                    </div>
                )}
                <Button label={"Add Service"} onClickFun={() => navigate("/create-service")}/>
            </div>
            <div>
                {dockerfiles.services.length > 0 && dockerfiles.services.map((service,key) => {
                    return (
                    <div key={key} className="my-4">
                        <div className="flex items-center">
                            <span className="text-xl font-medium text-gray-500">Service Name : </span>
                            <span className="text-xl font-medium text-gray-500 px-2 mr-4">{service.name}</span>
                            <Button label={"Delete Service"} onClickFun={() => delService(key)}/>
                        </div>
                        <DockerfileCode dockerfile={service.dockerfile}/>
                    </div>
                    )})}
            </div>
        </div>
    )
}