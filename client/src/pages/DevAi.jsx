import { useRecoilValue } from "recoil";
import { IoSend } from "react-icons/io5";
import useChat from "../hooks/useChat";
import { IoLogoDocker } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import FormattedCode from "../components/FormattedCode";
import {userDetailsAtom} from "../store/atoms/userDetailsAtom";

const DevAi = () => {
    const userDetails = useRecoilValue(userDetailsAtom);
    const {messages, isLoading, error, query, setQuery, sendQuery} = useChat();

    return (
        <div className="font-Satoshi">
            <div className="text-9xl font-bold text-center text-format-code-dark mt-10 mb-[20vh]">
                DEVAì
            </div>
            <div className="w-[90vw] border-4 border-violet-700/60 m-auto rounded-lg">
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
                            <div key={key} className="flex mt-8 items-center justify-end">
                                <div className={`rounded-full w-[35px] h-[35px] bg-contain bg-no-repeat bg-center border border-gray-300/70 bg-violet-300`} style={{backgroundImage:`url(${userDetails.profile_pic})`}}></div>
                                <div className="w-fit min-w-[20%] max-w-[80%] p-1 px-2 bg-violet-500/80 text-lg font-medium text-white rounded-lg mx-3 text-wrap break-all">{thread.content}</div>
                            </div>
                            )
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
                            <div className="w-fit border p-3 rounded-full text-3xl cursor-pointer mx-2 text-white bg-violet-700 hover:bg-violet-900 text-center shadow-lg"  onClick={sendQuery} style={{cursor:`${isLoading ? "not-allowed" : ""}`}}>
                               {isLoading ? <FiLoader className="animate-spin"/> : <IoSend/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-fit m-auto text-sm my-2 text-gray-500 mb-10">
                Information provided by Ai can be wrong, user descretion is required.
            </div>
        </div>
    )
}

export default DevAi;