import { apiService } from "./apiService";

const searchRegistryService = {
    fetchRegistry : (filters) => apiService.get("/search", filters),
    fetchTags : (filters) => apiService.get("/get-tags", filters),
}

export default searchRegistryService;