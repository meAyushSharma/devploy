// ON MAIN THREAD

export const downloadEnvFileHelper = async ({fileName}) => {
    try {
        const rootDir = await navigator.storage.getDirectory();
        const parentFolderHandle = await rootDir.getDirectoryHandle("environment", {create:true});
        const fileHandle = await parentFolderHandle.getFileHandle(fileName, {create:false});
        const file = await fileHandle.getFile();
        if (window.showSaveFilePicker) {
            // Use the modern API
            const saveHandle = await showSaveFilePicker({ suggestedName: fileName });
            const writable = await saveHandle.createWritable();
            await writable.write(await file.text());
            await writable.close();
        } else {
            // Fallback: Trigger download via an <a> element
            const json = JSON.parse(await file.text());
            const blob = new Blob([json.dockerfile], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName.split(".json")[0]}`;
            a.click();
            URL.revokeObjectURL(url);
        }
        console.log(`File ${fileName} downloaded successfully.`);
        return;
    }catch (err) {
        console.log("Some problem occured during file fetching for download: ", err);
        return;
    }
}