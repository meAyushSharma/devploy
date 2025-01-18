// ON Main thread

export const downloadComposeFileHelper = async ({folderName}) => {
    try {
        const rootDir = await navigator.storage.getDirectory();
        const parentFolderHandle = await rootDir.getDirectoryHandle("docker-compose", {create:true});
        const folderHandle = await parentFolderHandle.getDirectoryHandle(folderName, {create:false});
        const folderIterator = folderHandle.values();
        const files = [];
        for await (const handle of folderIterator){
            if(handle.kind === 'file'){
                const file = await handle.getFile();
                const text = await file.text();
                const json = JSON.parse(text);
                if(handle.name === "docker-compose.json"){
                    files.push({ name:handle.name, content:json });
                }else{
                    const fileText = json.dockerfile;
                    files.push({name : handle.name, content : fileText});
                }
            }
        }

        const createZip = async files => {
            try {
                const parts = files.map(file => new Blob([`\n\n-- File: ${file.name} --\n\n`, file.content], { type: "text/plain" }));
                const bundleBlob = new Blob(parts, { type: "application/octet-stream" });
                const a = document.createElement("a");
                const url = URL.createObjectURL(bundleBlob);
                a.href = url;
                a.download = "bundle.txt"; // Change to `.zip` if needed
                a.click();
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Error creating bundle:", err);
            }
        }
        createZip(files);
        console.log("successfully downloaded files")
        return;
    } catch (err) {
        console.log("some error occured during the downloading of compose: ", err);
        return;
    }
}