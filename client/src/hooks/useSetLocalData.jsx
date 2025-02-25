import { useState } from "react";
import { saveToLocal } from "../helper/saveToLocal";
import userApiService from "../utils/userApiService";

export const useSetLocalData = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [refreshedData, setRefreshedData] = useState(false);
    const setFetchedData = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const dbResponse = await userApiService.fetchDbData();
            const dbData = await dbResponse.data;

            if(!dbData?.success) {
                console.log("Data fetching from Database failed");
                setFetchError(dbData?.error);
            } else {
                // 1. create global array to store promises
                const dbDataPromises = [];

                // 2. save env files
                const saveEnvPromises = dbData.files.environments.map(async (envFile, index) => {
                    if(envFile.value) {
                        const setLocalEnvObj = {
                            workerPath : "../worker/saveEnvDockerfileWorker.js",
                            parentFolderName : "environment",
                            fileName : envFile.name,
                            content : { file : JSON.parse(envFile.value) , id : envFile.id },
                            childFolderName: "default",
                        }
                        try {
                            return await saveToLocal(setLocalEnvObj);
                        }catch(error){
                            console.error(`Error saving ENVIRONMENT envFile[${index}]:`, error);
                            return { data: { success: false }, error };
                        }
                    }
                    console.warn(`ENVIRONMENT envFile[${index}] does not have envFile.value`);
                    return { data: { success: true } };
                })

                // push promises to global array
                dbDataPromises.push(...saveEnvPromises);

                // 3. save compose files
                const allSaveComposeFolderPromises = [];
                dbData.files.composes.map(async (composeFile, composeFileIndex) => {
                    const { id, value, name } = composeFile;
                    const jsonVal = JSON.parse(value);
                    const { compose, services } = jsonVal.content;

                    // 3.1 save services
                    const saveComposePromises = services.map(async (composeFile, index) => {
                        if(composeFile.dockerfileDetails) {
                            const setLocalComposeObj = {
                                workerPath: '../worker/saveDockerComposeDockerfileWorker.js',
                                parentFolderName: "docker-compose",
                                fileName: composeFile.name,
                                content: { file : composeFile.dockerfileDetails, id: id },
                                childFolderName: name,
                            };
                            try {
                                return await saveToLocal(setLocalComposeObj);
                            }catch(error) {
                                console.error(`Error saving COMPOSE Service: composeFileIndex[${composeFileIndex}] ::: serviceIndex[${index}] ::: error is`, error);
                                return { data: { success: false }, error };
                            }
                        }
                        console.warn(`composeFileIndex[${composeFileIndex}] ::: serviceIndex[${index}] does not have dockerfileDetails.`);
                        return { data: { success: true } };
                    })

                    // 3.2 save compose file of SERVICE
                    const setComposeFileToLocalObj = {
                        workerPath: '../worker/saveDockerComposeDockerfileWorker.js',
                        parentFolderName: "docker-compose",
                        fileName: "docker-compose",
                        content: { file : compose.file, id: id },
                        childFolderName: name,
                    };
                    saveComposePromises.push(
                        saveToLocal(setComposeFileToLocalObj).catch(error => {
                            console.error("Error saving compose file to local from DB:", error);
                            return { data: { success: false }, error };
                        })
                    );
                    allSaveComposeFolderPromises.push(...saveComposePromises);
                });

                // push promises to global array
                dbDataPromises.push(...allSaveComposeFolderPromises);


                // 4. Resolve all the promises parallely
                const dbToLocalTransferResults = await Promise.all(dbDataPromises);
                const transferFailedRedults = dbToLocalTransferResults.filter(event => !event?.data?.success);
                setRefreshedData(true);
                if (transferFailedRedults.length > 0) {
                    console.error(`Failed saves from DB to Local:`, transferFailedRedults);
                    setRefreshedData("Some services could not be saved");
                }
            }
        }
        catch (err) {
            console.log("Error during transfer of data from DB to Local is : ", err);
            setFetchError(err);
        }
        finally {
            setIsFetching(false);
        }
    }
    return {
        isFetching, setFetchedData, fetchError, refreshedData
    }
}