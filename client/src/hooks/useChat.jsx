import { useState } from "react";
import aiSearchService from "../utils/aiSearchService";

const useChat = () => {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendQuery = async () => {
        if(isLoading) return;
        if(!query) return;
        setError(null);
        setIsLoading(true);
        try{
            let updatedMessages = [ ...messages, { role: "user", content: query } ];
            if(updatedMessages.length > 6) updatedMessages = updatedMessages.splice(2);
            setMessages(updatedMessages);

            const reply = await aiSearchService.askDevai({query: updatedMessages});
            const data = await reply.data;

            if(data.success){
                setMessages([...updatedMessages, {role:"assistant", content:data.msg}])
                setQuery("");
            }else{
                console.error("error during getting reply is: ", data.err);
                setError(data.err);
            }
        }
        catch (err) {
            console.error("Request failed:", err);
            setError(err.message || "Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    }
    return {
        messages,
        query,
        setQuery,
        sendQuery,
        isLoading,
        error,
    };
}

export default useChat;