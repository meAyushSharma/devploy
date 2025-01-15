// const saveComposeToLocal = (parentFolderName, childFolderName, fileName, content) => {
//     const worker = new Worker(new URL('../worker/saveDockerComposeDockerfileWorker.js', import.meta.url));
//     worker.postMessage({parentFolderName, childFolderName, fileName, content});
//     worker.onmessage = e => {
//         if(e.data.success) {
//             console.log("compose data save successfully to local");
//             // clear atoms after data is saved
//             const num = dockerfiles.services.length;
//             resetServiceAtoms(num)
//             navigate("/builds");
//             // show alert
//         }else {
//             console.error("the error saving compose data to local is: ", e.data.error);
//         }
//     }
// }

// const saveEnvToLocal = (folderName, fileName, content) => {
//     const worker = new Worker(new URL('../worker/saveEnvDockerfileWorker.js', import.meta.url));
//     worker.postMessage({folderName, fileName, content});
    
//     worker.onmessage = e => {
//         if(e.data.success){
//             // clear atoms before directing user to /builds
//             console.log("environment data saved successfully to local!");
//             navigator("/builds")
//         }else {
//             console.error("the error saving environment data to local is: ", e.data.error);
//         }
//     }
// }

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