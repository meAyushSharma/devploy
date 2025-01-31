import userApiService from "../utils/userApiService"

export const saveToDB = async ({jsonFile, type}) => {
    const name = jsonFile.name;
    const content = JSON.stringify(jsonFile);
    const response = await (type === "env" ? userApiService.saveEnv({ name, content }) : userApiService.saveCompose({ name, content }));
    return response;
}