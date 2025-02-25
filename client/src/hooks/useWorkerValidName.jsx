import { useEffect, useState } from "react";

export const useWorkerValidName = ({workerPath, debouncedName, type="env"}) => {
    const [nameIsValid, setNameIsValid] = useState(null);
    useEffect(() => {
        if (!debouncedName || debouncedName.includes("/") || debouncedName.includes(" ")) {
            setNameIsValid(null);
            return;
        }
        const worker = new Worker(new URL(workerPath, import.meta.url));
        const fetchNames = () => {
            worker.postMessage({});
            worker.onmessage = e => {
                if(e.data.success){
                    const dcFolderNames = e.data.names || [];
                    if(dcFolderNames.includes(type === "env" ? `${debouncedName}.json` : debouncedName)) setNameIsValid(false);
                    else setNameIsValid(true);
                }else console.log("some problem occured during compose folder name fetching", e.data.error)
            }
        }
        fetchNames();
        return () => worker.terminate();
    }, [debouncedName, setNameIsValid]);

    return nameIsValid;
}