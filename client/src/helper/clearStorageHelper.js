export const clearStorageHelper = ({workerPath}) => {
    return new Promise((res, rej) => {
        const worker = new Worker(new URL(workerPath, import.meta.url));
        worker.postMessage({});
        worker.onmessage = e => {
            worker.terminate();
            if(e.data.success) res(e);
            else res(e);
        }
        worker.onerror = err => {
            worker.terminate();
            rej(err);
        }
    })
}