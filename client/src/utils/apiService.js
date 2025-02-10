import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

api.interceptors.request.use(config => {
    config.headers["Content-Type"] = "application/json";
    config.withCredentials = true;
    const registerToken = Cookies.get("registerToken");
    const googleToken = Cookies.get("googleToken");
    const token = registerToken || googleToken;
    if(token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, err => {
    console.log("The error in api request is : ", err)
    Promise.reject(err)
})

api.interceptors.response.use(res => res, err => {
    if(err.response?.status === 401) console.error("Unauthorized, logging out...");
    if(err.response?.status === 500) console.error("Internal Server Error");
    return Promise.reject(err);
})

export const apiService = {
    get: (url, params, config = {}) => api.get(url, { ...config, params }),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),
}

export default api;