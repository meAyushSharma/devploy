import axios from "axios";
import { useEffect, useState } from "react";

export const useDockerFetch = (url) => {
    const [options, setOptions]=useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if(url==null || url.trim() == ""){
                setOptions([]);
                return;
            }
            setIsLoading(true);
            try{
                console.log("useFetchOptions() is fetching...");
                const query = await axios.get(url);
                const data = query.data;
                const formattedData = data.results.map(res => ({
                    label:`${res.repo_name} : ${res.short_description}  || Official : ${res.is_official} || Star Count : ${res.star_count}`,
                    value: `${res.repo_name}`
                }));
                console.log("useFetchOptions() data:", data);
                setOptions(formattedData);
                setIsLoading(false);
            }catch(err){
                console.error("")
            }
        }
        const debounceValue=setTimeout(fetchData, 500);
        return () => clearTimeout(debounceValue);
    }, [url]);
    return { options, isLoading }
}