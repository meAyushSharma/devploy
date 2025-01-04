import { useEffect, useState } from "react";

export const useDebounce = (inputvalue, delay=1000) => {
    const [debounceValue, setDebounceValue] = useState(inputvalue);
    useEffect(()=>{
        const int = setTimeout(()=>{
            setDebounceValue(inputvalue);
        }, delay)
        return () => clearTimeout(int);
    },[inputvalue]);
    return debounceValue;
}