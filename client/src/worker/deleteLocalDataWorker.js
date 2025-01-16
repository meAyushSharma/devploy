self.addEventListener('message', async e => {
    const {parentFolder, handle} = e.data;
    try {
        const rootDir = await navigator.storage.getDirectory();
        const parentFolderHandle = await rootDir.getDirectoryHandle(parentFolder, {create:true});
        if(handle.kind === 'file'){
            // in case of environment
            const fileHandle = await parentFolderHandle.getFileHandle(handle.name, {create:true});
            await fileHandle.remove();
            self.postMessage({success:true});
        }else if(handle.kind === 'directory'){
            const directoryHandle = await parentFolderHandle.getDirectoryHandle(handle.name, {create:true});
            await directoryHandle.remove({recursive: true});
            self.postMessage({success:true})
        }
    }catch (err) {
        self.postMessage({success:false, error: err})
    }
})