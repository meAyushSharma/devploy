import Button from "../common/Button";
import { FaGoogle } from "react-icons/fa6";

const AuthFooter = ({category}) => {
    const type = category === "Signup";
    return (
    <div>
        <div className="w-full h-[2px] bg-gray-500 my-4"></div>
        <div className="">
            <Button>
                Signup/Login with <FaGoogle />
            </Button>
        </div>
        {type && <div className="text-sm font-medium text-gray-700 text-center mt-2">
                <span>Already have an account ?{" "}</span>
                <a href="/login" className="hover:text-violet-950">Login</a>
        </div>}
    </div>
    )
}

export default AuthFooter;