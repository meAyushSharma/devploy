// ON WORKER

self.addEventListener('message', async () => {
    try {
        const rootDir = await navigator.storage.getDirectory(); // get root
        const envFolder = await rootDir.getDirectoryHandle('environment', {create: true});
        const dockerComposeFolder = await rootDir.getDirectoryHandle('docker-compose', { create: true });
        console.log("created directory successfully!");
        self.postMessage({ success: true });
    } catch (err) {
        console.error("error creating opfs file structure: ", err);
        self.postMessage({ success: false, error: err.message });
    }
})