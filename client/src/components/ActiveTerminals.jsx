import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect, useRef, useState } from "react";
import {userModeSelector} from "../store/selectors/userModeSelector";
import {Terminal} from "@xterm/xterm";
import {FitAddon} from "@xterm/addon-fit";
import { AttachAddon } from '@xterm/addon-attach';
import "@xterm/xterm/css/xterm.css";
import useWebSocket , { ReadyState } from "react-use-websocket";
import { userDetailsAtom } from "../store/atoms/userDetailsAtom";
import Button from "./common/Button";
import { IoTerminal } from "react-icons/io5";
import { IoTerminalOutline } from "react-icons/io5";
import { IoExit } from "react-icons/io5";
import { FaCircleStop } from "react-icons/fa6";

const ActiveTerminals = ({terminal, index}) => {
    const token = useRecoilValue(userModeSelector);
    if (!token) return <div>Not authenticated</div>;
    const WS_URL = `${import.meta.env.VITE_BACKEND_DOMAIN_URL}/ws?token=${token}&contId=${terminal.contDockerId}` || `https://server.devploynest.in/ws?token=${token}&contId=${terminal.contDockerId}`
    console.log("WS_URL: ", WS_URL);
    const userDetails = useRecoilValue(userDetailsAtom);
    const termRef = useRef(null);
    const wsRef = useRef(null);
    const term = useRef(null);
    const retryRef = useRef(0);
    let inputBuffer = "";
    const [terminalToggle, setTerminalToggle] = useState(true);

    const handleExit = (e) => {
        if(wsRef.current && term.current) {
            wsRef.current.send("exit");
        }
    }

    const handleStop = e => {
        if(wsRef.current && term.current) {
            wsRef.current.send("SIGINT");
        }
    }
    
    useEffect(() => {
        term.current = new Terminal({
            cursorBlink: true,
            disableStdin: false,
            theme: {
                background:"#1E1E3F",
                foreground:"#A599E9",
                selectionBackground:"#adb5bd",
                selectionForeground:"#212529",
            },
            rows:"30",
            scrollback:1500,
            fontSize:16
        });
        const fitAddon = new FitAddon();
        term.current.loadAddon(fitAddon);

        const connectWebSocket = () => {
            if (retryRef.current >= 2){
                return;
            }
            if (!termRef.current) return;
            if (termRef.current) {
                term.current.open(termRef.current);
                fitAddon.fit();
                term.current.write("Connecting to container...\r\n");
    
                // Connect to WebSocket server
                wsRef.current = new WebSocket(WS_URL);
    
                wsRef.current.onopen = () => {
                    retryRef.current = 0;
                    term.current.write(`~ User: ${userDetails.email}\r\n~ Logged into container: [${terminal.containerName}]\r\n~ At time: ${(new Date()).toISOString()}\r\n~ Enter exit to kill shell/terminal\r\n~ Enter ctrl+c to stop running process in shell/terminal.\r\n~ Type your commands below: \r\n`);
                };
    
                wsRef.current.onmessage = (event) => {
                    term.current.write(event.data);
                };

                term.current.attachCustomKeyEventHandler((event) => {
                    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v')) {
                        return true;
                    }
                    return true;
                });
    
                // Capture user input and send it to WebSocket
                term.current.onKey(({ key, domEvent }) => {
                    console.log(domEvent.key);
                
                    const isPrintable = /^[a-zA-Z0-9:/.,!?_\-\s]$/.test(key);
                
                    if (domEvent.key === "Enter") {
                        if (inputBuffer.trim()) {
                            console.log("Input buffer before sending:", inputBuffer);
                            term.current.write("\r\n");
                            wsRef.current.send(inputBuffer);
                            inputBuffer = "";
                        }
                    }
                    else if (domEvent.key === "Backspace") {
                        if (inputBuffer) {
                            term.current.write("\b \b");
                            inputBuffer = inputBuffer.slice(0, -1);
                        }
                    }
                    else if (domEvent.ctrlKey && domEvent.key === "c") {
                        const selection = term.current.getSelection();
                        if (selection) {
                            document.execCommand("copy");
                        } else {
                            wsRef.current.send("SIGINT");
                        }
                    }
                    else if (domEvent.ctrlKey && domEvent.key === "v") {
                        navigator.clipboard.readText().then((text) => {
                            inputBuffer += text;
                            term.current.write(text);
                        });
                    }
                    else {
                        if (isPrintable) {
                            inputBuffer += key;
                            term.current.write(key);
                        } else {
                            domEvent.preventDefault();
                        }
                    }
                });
                
                
    
                wsRef.current.onclose = () => {
                    retryRef.current += 1;
                    setTimeout(connectWebSocket, 2000 * retryRef.current);
                    term.current.write("\r\nDisconnected from container.\r\n");
                };
            }
        }
        connectWebSocket();


        return () => {
            term.current.dispose();
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    return (
        <div className="rounded-lg border-2 border-gray-950/60 my-4 py-4">
            <div className="md:text-xl sm:text:-md text-base text-gray-800 font-medium w-[96%] m-auto flex justify-between items-center">
                <span>{index}. Terminal to service : <span className="border-b-2 border-dashed border-gray-950">{terminal.containerName}</span></span>
                <span className="flex gap-4 items-center">
                    <FaCircleStop className="text-gray-950/90 text-xl sm:text-2xl cursor-pointer hover:text-gray-950" onClick={handleStop}/>
                    <IoExit className="text-gray-950/90 sm:text-4xl text-2xl cursor-pointer hover:text-gray-950" onClick={handleExit}/>
                    {terminalToggle ? 
                    <IoTerminal className={`text-gray-950/90 sm:text-3xl text-xl cursor-pointer hover:text-gray-950`} onClick={() => setTerminalToggle(state => !state)}/>
                    : <IoTerminalOutline className="text-gray-950/90 sm:text-3xl text-xl cursor-pointer hover:text-gray-950" onClick={() => setTerminalToggle(state => !state)}/>}
                </span>
            </div>
            <div ref={termRef} className={`w-[96%] h-full bg-rose-500 text-white m-auto my-5 ${terminalToggle ? "":"hidden"}`}></div>
        </div>
    )
};

export default ActiveTerminals;
