export const removeLocalHelper = (parentFolder, handle) => {
    return new Promise((res, rej) => {
        const worker = new Worker(new URL("../worker/deleteLocalDataWorker.js", import.meta.url));
        worker.postMessage({ parentFolder, handle });
        worker.onmessage = e => {
            worker.terminate();
            if(e.data.success) res(e.data.success);
            else rej(e.data.success);
        };
        worker.onerror = err => {
            worker.terminate();
            rej(err);
        }
    })
}