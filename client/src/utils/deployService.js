import apiService from "./apiService";

const deployService = {
    deployEnvironment : (data) => apiService.post("/container-orchestration/deploy-env", data)
}
export default deployService;