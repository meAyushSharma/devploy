import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSaveEnvironment = ({ setTestDockerfile, resetEnvAtoms, setServiceCount, saveToDB, saveToLocal, dockerfileJSON, env, name, isUserRegistered }) => {
    const navigator = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const saveProject = async ({ id }) => {
        setTestDockerfile(dockerfileJSON);
        const obj = { workerPath: '../worker/saveEnvDockerfileWorker.js', parentFolderName: "environment", fileName: name,
            content: { file: dockerfileJSON, id: id },
            childFolderName: "default"
        };

        const event = await saveToLocal(obj);
        if (event.data.success) {
            console.log("Successfully saved env data on local");
            resetEnvAtoms();
            navigator("/builds");
        } else {
            console.error("The error saving environment data to local is: ", event.data.error);
        }
    };

    const saveEnvironment = async () => {
        if(isSaving) return;
        if (env) {
            setIsSaving(true);
            if(isUserRegistered){
                try {
                    const dbResponse = await saveToDB({ jsonFile: dockerfileJSON, type: "env" });
                    if (dbResponse?.data.success) {
                        console.log("Successfully saved env data on Database");
                        await saveProject({ id: dbResponse.data.id });
                        // alert user
                    } else {
                        console.log("Error saving env data to Database : ", dbResponse.data.error);
                        alert("Error occurred during saving of environment");
                    }
                } catch (err) {
                    console.log("Error saving environment data either in db or local : ", err);
                    alert("Some error occurred, environment not saved");
                } finally {
                    setIsSaving(false);
                }
            }
            else {
                try {
                    await saveProject({id : 1});
                } catch (err) {
                    console.error("Error during env file save to local in guest mode : ", err);
                } finally {
                    setIsSaving(false);
                }
            }
        } else {
            setTestDockerfile(dockerfileJSON);
            setServiceCount(count => count + 1);
            navigator("/docker-compose");
        }
    };

    return { saveEnvironment, isSaving };
};
