// ON WORKER

self.addEventListener('message', async e => {
    const { folderName="environment", fileName, content } = e.data;
    try {
        const rootDir = await navigator.storage.getDirectory();
        const folderHandle = await rootDir.getDirectoryHandle(folderName, {create:true});
        const fileHandle = await folderHandle.getFileHandle(`${fileName}.json`, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(content));
        await writable.close();
        self.postMessage({ success: true });
    }catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
})