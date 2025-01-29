import { useEffect, useState } from "react";
import searchRegistryService from "../utils/searchRegistryService";

export const useFetchRegistry = ({inputValue, requestFor}) => {
    const forDocker = requestFor === "docker";
    const controller = new AbortController();
    const [data, setData] = useState(forDocker ? [] : null);
    const [isLoading, setIsLoading] = useState(inputValue ? true : false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if(inputValue == null || inputValue.trim() == "" || !requestFor){
                setData(forDocker ? [] : null);
                return;
            }
            setIsLoading(true);

            try{
                if(requestFor === "docker"){
                    const query = await searchRegistryService.fetchRegistry({q : inputValue, requestFor});
                    const data = query.data;
                    const formattedData = data.results.map(res => ({
                        label:`${res.repo_name}; Official:${res.is_official}`,
                        value: `${res.repo_name}`
                    }));
                    setData(formattedData);
                }
                else {
                    setIsLoading(true);
                    const response = await searchRegistryService.fetchRegistry({q : inputValue, requestFor})
                    setData(response.data);
                }
            } catch(err){
                console.error(`Error in useFetchRegistry is: ${err.message}`);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }
        const debounceValue=setTimeout(fetchData, 700);
        return () => {
            clearTimeout(debounceValue);
            controller.abort();
        }
    }, [inputValue, requestFor]);

    return { data, isLoading, error }
}