self.addEventListener("message", async e => {
  if (!e) return [];
  try {
    const rootDir = await navigator.storage.getDirectory();
    const { directoryHandle } = e.data;
    let dirHandle = "";
    if (directoryHandle) dirHandle = await rootDir.getDirectoryHandle(directoryHandle, { create: true });

    const getDirectoryEntriesRecursive = async (directoryHandle, relativePath = ".") => {
      const fileHandles = [];
      const directoryHandles = [];
      const entries = {};
      // Get an iterator of the files and folders in the directory.
      const directoryIterator = directoryHandle.values();
      const directoryEntryPromises = [];
      for await (const handle of directoryIterator) {
        const nestedPath = `${relativePath}/${handle.name}`;
        if (handle.kind === "file") {
          fileHandles.push({ handle, nestedPath });
          directoryEntryPromises.push(
            handle.getFile().then(async (file) => {
              const accessHandle = await handle.createSyncAccessHandle();
              const textDecoder = new TextDecoder();
              let size = accessHandle.getSize();
              const dataView = new DataView(new ArrayBuffer(size));
              accessHandle.read(dataView);
              const toBeJSON = textDecoder.decode(dataView)
              const JSONdata = JSON.parse(toBeJSON);
              return {
                name: handle.name,
                kind: handle.kind,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                relativePath: nestedPath,
                jsonContent: JSONdata,
                handle,
              };
            })
          );
        } else if (handle.kind === "directory") {
          directoryHandles.push({ handle, nestedPath });
          directoryEntryPromises.push(
            (async () => {
              return {
                name: handle.name,
                kind: handle.kind,
                relativePath: nestedPath,
                entries: await getDirectoryEntriesRecursive(handle, nestedPath),
                handle,
              };
            })()
          );
        }
      }
      const directoryEntries = await Promise.all(directoryEntryPromises);
      directoryEntries.forEach((directoryEntry) => {
        entries[directoryEntry.name] = directoryEntry;
      });
      return entries;
    };

    const toSend = await getDirectoryEntriesRecursive(
      directoryHandle ? dirHandle : rootDir,
      "."
    );
    self.postMessage({ success: true, data: toSend });
  } catch (err) {
    self.postMessage({ success: false, error: err });
  }
});
