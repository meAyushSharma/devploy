import apiService from "./apiService";

const deployService = {
    deployEnvironment : (data) => apiService.post("/container-orchestration/deploy-env", data),
    getActiveContainers : () => apiService.get("/container-orchestration/get-active-containers"),
    terminateService : (data) => apiService.post("/container-orchestration/terminate-service", data),
}
export default deployService;