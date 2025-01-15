// ON WORKER

self.addEventListener('message', async e => {
    try {
        const rootDir = await navigator.storage.getDirectory();
        const envFolder = await rootDir.getDirectoryHandle('environment', { create: true });
        const fileNames = [];
        for await (const [name, handle] of envFolder.entries()) {
            if(handle.kind === 'file') fileNames.push(name);
        }
        self.postMessage({ success: true, names: fileNames});
    } catch (err) {
        console.error("Error checking environment folder contents: ", err);
        self.postMessage({ success: false, error: err.message });
    }
})