import { memo } from "react";
import { useNavigate } from "react-router-dom";

export const NewProjectButton = memo(({label, navigateTo}) => {
    const navigate = useNavigate();
    return <div className="bg-cyan-500 p-3 text-white font-medium text-xl text-center rounded-md w-fit m-auto cursor-pointer my-2" onClick={()=> navigate(navigateTo) }>
        {label}
    </div>
});