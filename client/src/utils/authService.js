import { apiService } from "./apiService";

const authService = {
    registerUser : (data) => apiService.post("/auth/signup", data),
    loginUser : (data) => apiService.post("/auth/login", data),
    googleAuth : (data) => apiService.post("/auth/google", data),
    verifyMail : (data) => apiService.post("/auth/verify-email", data),
}

export default authService;