// ON WORKER

self.addEventListener('message', async e => {
    const { parentFolderName="docker-compose", childFolderName, fileName, content } = e.data;
    try {
        const rootDir = await navigator.storage.getDirectory();
        const parentFolderHandle = await rootDir.getDirectoryHandle(parentFolderName, {create:true});
        const childFolderHandle = await parentFolderHandle.getDirectoryHandle(childFolderName, { create: true });
        const fileHandle = await childFolderHandle.getFileHandle(fileName, {create:true});
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        self.postMessage({ success: true });
    }catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
})