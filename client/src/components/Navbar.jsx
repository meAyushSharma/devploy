import { useNavigate } from "react-router-dom";
import { memo } from "react";

export const Navbar = memo(() => {
    const navigate = useNavigate();
    return <>
        <div className="font-Satoshi flex justify-between border-2 text-xl">
            <div className="border-2 cursor-pointer" onClick={() => navigate('/')}>DevBox</div>
            <div className="flex justify-between border-2 mr-3">
                <div className="mx-3 cursor-pointer" onClick={()=> navigate('/about')}>About us</div>
                <div className="mx-3 cursor-pointer" onClick={()=> navigate('/guide')}>Guide</div>
                <div className="mx-3 cursor-pointer" onClick={() => navigate('/builds')}>Builds</div>
            </div>
        </div>
    </>
});