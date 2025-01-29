import { apiService } from "./apiService";

const searchRegistryService = {
    fetchRegistry : (filters) => apiService.get("/search", filters)
}

export default searchRegistryService;