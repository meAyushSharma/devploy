import { memo } from "react";
import { useNavigate } from "react-router-dom";

export const NewProjectButton = memo(() => {
    const navigate = useNavigate();
    return <div className="bg-cyan-500 p-3 text-white font-medium text-xl text-center rounded-md w-1/3 m-auto cursor-pointer my-2" onClick={()=> navigate('/create-project') }>
        Create a new project
    </div>
});