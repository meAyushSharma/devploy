export const saveToLocal = ({workerPath, parentFolderName, fileName, content, childFolderName}) => {
    return new Promise((res, rej) => {
        const env = parentFolderName === "environment";
        const compose = parentFolderName === "docker-compose";
        const envObj = {
            folderName:parentFolderName,
            fileName: fileName,
            content: content
        };
        const composeObj = {
            parentFolderName: parentFolderName,
            childFolderName: childFolderName,
            fileName: fileName,
            content: content
        }
        const objToSend = env ? envObj : compose ? composeObj : {};
        const worker = new Worker(new URL(workerPath, import.meta.url));
        worker.postMessage(objToSend);
        worker.onmessage = e => {
            worker.terminate();
            if(e.data.success) res(e);
            else rej(new Error(e.data.error));
        }
        worker.onerror = err => {
            worker.terminate();
            rej(err);
        }
    })
}