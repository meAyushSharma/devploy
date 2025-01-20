import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { IoLogoDocker } from "react-icons/io5";
import axios from "axios"
import FormattedCode from "../components/FormattedCode";

const DevAi = () => {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);

    const sendQuery = async () => {
        if(!query) return;
        const updatedMessages = [
            ...messages,
            { role: "user", content: query }
          ];
        setMessages(updatedMessages);
        console.log("this is updatedMessages: ", updatedMessages);

        const reply = await axios.post("http://localhost:3007/api/v1/devai/ask",
            {query: updatedMessages}, 
            { headers:{ "Content-Type":"application/json" }});

        const data = await reply.data;
        if(data.success){
            setMessages([...updatedMessages, {role:"assistant", content:data.msg}])
            setQuery("");
        }else{
            console.error("error during getting reply is: ", data.err);
        }
    }

    return (
        <div className="font-Satoshi">
            <div className="text-9xl font-bold text-center text-[#17191E] mt-10 mb-[20vh]">
                DEVAì
            </div>
            <div className="w-[90vw] border-4 border-violet-700/60 m-auto rounded-lg mb-10">
                <div className="min-h-[60vh] h-[65vh] overflow-y-auto" style={{"scrollbarWidth": "thin"}}>
                    {messages.length == 0 && (
                        <div className="bg-violet-500/60 bg-[url('./assets/docker-compose-empty.png')] bg-contain bg-no-repeat bg-center h-[60vh] m-4 rounded-lg grid p-2">
                            <span className="text-lg font-bold text-white">DEVAì</span>
                            <span className="text-xl font-bold text-white">DEVAì</span>
                            <span className="text-2xl font-bold text-white">DEVAì</span>
                            <span className="text-3xl font-bold text-white">DEVAì</span>
                            <span className="text-4xl font-bold text-white">DEVAì</span>
                            <span className="text-5xl font-bold text-white">DEVAì</span>
                        </div>
                    )}
                    {messages.map((thread,key) => {
                        if(thread.role === "user"){
                            return (
                                <div key={key} className="w-fit max-w-[80%] ml-auto p-2 bg-violet-500/80 text-lg font-medium text-white rounded-lg mx-4 mt-8 text-wrap">
                                    <span>{thread.content}</span>
                                </div>)
                        }else{
                            return (
                                <div key={key} className="mr-auto min-w-[60%] flex items-center gap-3">
                                    <div className="max-w-[80%] grid overflow-auto rounded-lg">
                                        <FormattedCode code={thread.content}/>
                                    </div>
                                    <div className="bg-[url('./assets/cube_single.png')] bg-violet-500 rounded-full w-[50px] h-[50px] bg-contain bg-no-repeat bg-center text-3xl grid place-content-center text-white">
                                        {/* <IoLogoDocker /> */}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <div>
                    <div className="m-4 rounded-lg font-medium">
                        <label htmlFor="ask-devai" className="text-sm font-semibold text-gray-700 m-2">Ask DevAì : </label>
                        <div className="mx-2 flex items-center mb-6">
                            <textarea name="" id="ask-devai" value={query} className="border-2 border-gray-500 focus:border-gray-500 w-full p-2 rounded" rows={1} onChange={e => setQuery(e.target.value)}></textarea>
                            <div className="w-fit border p-3 rounded-full text-3xl mx-2 cursor-pointer text-white bg-violet-700 hover:bg-violet-900 text-center shadow-lg"  onClick={sendQuery}>
                                <IoSend/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DevAi;