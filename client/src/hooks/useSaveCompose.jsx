import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSaveCompose = ({ saveToDB, saveToLocal, dockerfiles, composeFile, debouncedName, nameIsValid, resetAllAtoms, isUserRegistered }) => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const saveCompose = async ({ id }) => {
        try {
            // Save individual service files
            const savePromises = dockerfiles.services.map(async (service, index) => {
                if (service.dockerfileDetails) {
                    const idInDockerComposeFile = { file: service.dockerfileDetails, id };
                    const obj = {
                        workerPath: '../worker/saveDockerComposeDockerfileWorker.js',
                        parentFolderName: "docker-compose",
                        fileName: service.dockerfileDetails.name,
                        content: idInDockerComposeFile,
                        childFolderName: debouncedName,
                    };
                    try {
                        return await saveToLocal(obj);
                    } catch (error) {
                        console.error(`Error saving service at index ${index}:`, error);
                        return { data: { success: false }, error };
                    }
                }
                console.warn(`Service at index ${index} does not have dockerfileDetails.`);
                return { data: { success: true } };
            });

            const idInCompose = { file: composeFile, id };
            const composeObj = {
                workerPath: '../worker/saveDockerComposeDockerfileWorker.js',
                parentFolderName: "docker-compose",
                fileName: "docker-compose",
                content: idInCompose,
                childFolderName: debouncedName,
            };
            savePromises.push(
                saveToLocal(composeObj).catch(error => {
                    console.error("Error saving compose file to local:", error);
                    return { data: { success: false }, error };
                })
            );

            // Execute all service file saves
            const results = await Promise.all(savePromises);
            const failedResults = results.filter(event => !event?.data?.success);
            if (failedResults.length > 0) {
                console.error(`Failed saves:`, failedResults);
                // alert user
                alert("Some services could not be saved. Check the console for details.");
            } else {
                resetAllAtoms();
                navigate("/builds");
            }
        } catch (err) {
            console.error("Unexpected error in saveCompose:", err);
        }
    };

    const saveComposeToDB = async () => {
        if(isSaving) return;
        if (!nameIsValid) return;
        setIsSaving(true);
        if(isUserRegistered){
            const jsonFile = {
                name: debouncedName,
                content: {
                    services: dockerfiles.services,
                    compose: {
                        name: "docker-compose",
                        file: composeFile,
                    },
                },
            };
    
            try {
                const dbResponse = await saveToDB({ jsonFile, type: "compose" });
                if (dbResponse.data?.success) {
                    console.log("Successfully saved compose to database");
                    await saveCompose({ id: dbResponse.data.id });
                } else {
                    console.error("Error saving compose to database: ", dbResponse.data.error);
                }
            } catch (err) {
                console.log("Error saving compose data either in DB or local: ", err);
                alert("Some error occurred, compose not saved");
            } finally {
                setIsSaving(false);
            }
        } else {
            try {
                await saveCompose({id: 1});
            } catch (err) {
                console.error("Error in saving Compose file locally in guest mode: ", err);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return { saveComposeToDB, isSaving };
};
