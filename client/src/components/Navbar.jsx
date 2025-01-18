import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className="font-Satoshi flex justify-between text-xl w-[90vw] m-auto border-b-2 rounded-lg">
            <div className="cursor-pointer text-2xl font-semibold my-2 p-1" onClick={() => navigate('/')}>DevBox</div>
            <div className="flex justify-between items-center text-gray-700">
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={()=> navigate('/about')}>
                    About us
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={()=> navigate('/guide')}>
                    Guide
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="mx-3 cursor-pointer rounded-md p-1 hover:bg-[#f2f3f3] relative group" onClick={() => navigate('/builds')}>
                    Builds
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                    </div>
            </div>
        </div>
    )
}
export default Navbar;

