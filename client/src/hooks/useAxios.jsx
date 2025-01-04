import { useEffect, useState } from "react";
import axios from "axios";

export const useAxios = (url) => {
    const controller = new AbortController();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!url) {
            setData(null);
            setIsLoading(false);
            setError(null);
            return;
        }
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(url);
                setData(response.data);
                console.log("Fetched data:", response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }
        const debouncedValue = setTimeout(fetchData, 700);
        return () => {
            clearTimeout(debouncedValue);
            controller.abort();
        }
    }, [url]);
    return { data, isLoading, error };
}