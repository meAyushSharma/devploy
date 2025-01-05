import { useEffect, useState } from "react";

// not in use currently...
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