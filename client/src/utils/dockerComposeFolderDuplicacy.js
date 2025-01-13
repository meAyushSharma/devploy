// ON MAIN THREAD

export const dockerComposeFolderDuplicacy = async () => {
    try {
        const rootDir = await navigator.storage.getDirectory();
        const dockerComposeFolder = await rootDir.getDirectoryHandle('docker-compose', { create: true });
        const folderNames = [];
        for await (const [name, handle] of dockerComposeFolder.entries()) {
            if (handle.kind === 'directory') folderNames.push(name)
        }
        return folderNames;
    } catch (err) {
        console.error("Error checking docker-compose folder names: ", err);
        return [];
    }
}