// ON MAIN THREAD

export const envNameDuplicacy = async () => {
    try {
        const rootDir = await navigator.storage.getDirectory();
        const envFolder = await rootDir.getDirectoryHandle('environment', { create: true });
        const fileNames = [];
        for await (const [name, handle] of envFolder.entries()) {
            if (handle.kind === 'file') {
                fileNames.push(name); // Collect file names
            }
        }
        return fileNames;
    } catch (err) {
        console.error("Error checking environment folder contents: ", err);
        return [];
    }
}