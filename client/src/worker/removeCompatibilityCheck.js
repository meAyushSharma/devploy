self.addEventListener('message', async e => {
    if(!e) return null;
    try {
        if (!navigator.storage || !navigator.storage.getDirectory) {
            console.log("OPFS is not supported in your browser.");
            self.postMessage({success:false});
        }
        const rootDir = await navigator.storage.getDirectory();
        const tempFileHandle = await rootDir.getFileHandle('temp-file.txt', { create: true });
        if (typeof tempFileHandle.remove === "function") {
            console.log("Your browser supports the remove() method in OPFS.");
        } else {
            console.log("Your browser does not support the remove() method in OPFS.");
        }

        // Clean up the temporary file if it was created
        await rootDir.removeEntry('temp-file.txt');
        self.postMessage({success: true});
    } catch (error) {
        console.error("An error occurred while checking OPFS compatibility:", error);
        self.postMessage({success:false});
    }
})