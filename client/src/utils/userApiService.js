import { apiService } from "./apiService"

const userApiService = {
    saveEnv : (data) => apiService.post("/user/save-env", data),
    saveCompose : (data) => apiService.post("/user/save-compose", data),
    deleteEnvironment : (data) => apiService.post("/user/del-env", data),
    deleteCompose : (data) => apiService.post("/user/del-compose", data),
    fetchDbData : () => apiService.get("/user/get-data"),
    resetPassword: (data) => apiService.post("/user/reset-pass", data),
    deleteAccount: () => apiService.get("/user/delete-account"),
}

export default userApiService;