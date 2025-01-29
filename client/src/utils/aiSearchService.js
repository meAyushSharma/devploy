import { apiService } from "./apiService";

const aiSearchService = {
    askDevai : (data) => apiService.post("/devai/ask", data)
}

export default aiSearchService;
