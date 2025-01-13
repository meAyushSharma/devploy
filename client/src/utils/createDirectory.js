// ON MAIN THREAD

export const createDirectory = async () => {
    try {
        const rootDir = await navigator.storage.getDirectory(); // get root
        const envFolder = await rootDir.getDirectoryHandle('environment', {create: true});
        const dockerComposeFolder = await rootDir.getDirectoryHandle('docker-compose', { create: true });
        console.log("created directory successfully!");
    } catch (err) {
        console.error("error creating opfs file structure: ", err);
    }
}