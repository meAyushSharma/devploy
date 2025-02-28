import { apiService } from "./apiService";

const authService = {
    registerUser : (data) => apiService.post("/auth/signup", data),
    loginUser : (data) => apiService.post("/auth/login", data),
    googleAuth : (data) => apiService.post("/auth/google", data),
    verifyMail : (data) => apiService.post("/auth/verify-email", data),
    verifyEmailForgotPassword: (data) => apiService.post("/auth/verify-email-forgotpass", data),
    resetForgottenPassword: (data) => apiService.post("/auth/forgot-password-reset", data),
}

export default authService;