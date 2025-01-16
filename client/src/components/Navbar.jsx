import { useNavigate } from "react-router-dom";
import { memo } from "react";

export const Navbar = memo(() => {
    const navigate = useNavigate();
    return (
        <div className="font-Satoshi flex justify-between text-xl w-[90vw] m-auto border-b-2 rounded-lg">
            <div className="cursor-pointer text-2xl font-semibold my-2 p-1" onClick={() => navigate('/')}>DevBox</div>
            <div className="flex justify-between items-center">
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3]" onClick={()=> navigate('/about')}>About us</div>
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3]" onClick={()=> navigate('/guide')}>Guide</div>
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3]" onClick={() => navigate('/builds')}>Builds</div>
            </div>
        </div>
    )
});