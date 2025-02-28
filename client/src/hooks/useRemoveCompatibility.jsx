import { useEffect, useState } from "react";

export const useRemoveCompatibility = () => {
    const [compatible, setCompatible] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const worker = new Worker(new URL("../worker/removeCompatibilityCheck.js", import.meta.url));
                worker.postMessage({});
                worker.onmessage = e => {
                    worker.terminate();
                    if (e.data.success) setCompatible(true);
                    else setCompatible(false);
                };
            } catch (err) {
                console.error("Error in checkCompatibility of remove:", err);
            }
        };
        fetchData();
    }, []);
    return {
        compatible
    };
}