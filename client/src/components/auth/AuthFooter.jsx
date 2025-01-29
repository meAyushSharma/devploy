import Button from "../common/Button";
import { FaGoogle } from "react-icons/fa6";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthFooter = ({category}) => {
    const type = category === "Signup";
    const navigate = useNavigate();
    const login = useGoogleLogin({
        onSuccess: async ({code}) => {
            const res = await axios.post('http://localhost:3007/api/v1/auth/google', {code}, {
            headers:{ "Content-Type":"application/json" }, 
            withCredentials:true });

            if(res.data.success){
                console.log(res.data.msg);
                navigate("/");
            }else{
                console.log(res.data.msg);
                console.error("Error during googleAuth is: ", res.data.error);
            }
            // const authObj = jwtDecode(res.data.tokens.id_token);
            // console.log(authObj);
            // const response = await axios.post("http://localhost:3007/api/v1/auth/google/refresh-token", {refreshToken: res.data.tokens.refresh_token}, {headers:{"Content-Type":"application/json"}, withCredentials:true})
            // console.log(response.data);
        },
        flow:"auth-code",
        onError: (err) => console.log("error is: ", err)
      });
    return (
    <div>
        <div className="w-full h-[2px] bg-gray-500 my-4"></div>
        <div onClick={() => login()}>
            <Button>
                Signup/Login with <FaGoogle />
            </Button>
        </div>
        <div className="text-sm font-medium text-gray-700 text-center mt-2">
                <span>{type ? "Already have an account ?": "Don't have an account ?"}{" "}</span>
                {type ? <a href="/login" className="hover:text-violet-950">Login</a> : <a href="/signup" className="hover:text-violet-950">Signup</a>}
                
        </div>
    </div>
    )
}

export default AuthFooter;