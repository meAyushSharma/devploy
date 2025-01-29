// ON MAIN THREAD
export const clearOpfsStorage = async () => {
        try {
            const rootDir = await navigator.storage.getDirectory();
            async function clearDirectory(directory) {
                for await (const [name, handle] of directory) {
                    if (handle.kind === "directory") {
                        const subDir = await directory.getDirectoryHandle(name);
                        await clearDirectory(subDir);
                        await directory.removeEntry(name, { recursive: true });
                    } else if (handle.kind === "file") {
                        await directory.removeEntry(name);
                    }
                }
            }
            await clearDirectory(rootDir);
            const envFolder = await rootDir.getDirectoryHandle('environment', {create: true});
            const dockerComposeFolder = await rootDir.getDirectoryHandle('docker-compose', { create: true });
            console.log("OPFS storage cleared and Created anew!");
            return { success:true }
        } catch (error) {
            console.error("Error clearing OPFS storage and creating anew:", error);
            return {
                success: false,
                error: error
            }
        }
}