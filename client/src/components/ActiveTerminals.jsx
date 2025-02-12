import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect, useRef, useState } from "react";
import {userModeSelector} from "../store/selectors/userModeSelector";
import {Terminal} from "@xterm/xterm";
import {FitAddon} from "@xterm/addon-fit";
import { AttachAddon } from '@xterm/addon-attach';
import "@xterm/xterm/css/xterm.css";
import useWebSocket , { ReadyState } from "react-use-websocket";
import { userDetailsAtom } from "../store/atoms/userDetailsAtom";


// const ActiveTerminals = () => {
    // const token = useRecoilValue(userModeSelector);
    // if (!token) return <div>Not authenticated</div>;

//     const termRef = useRef(null);
//     const wsRef = useRef(null);

//     useEffect(() => {
//             const term = new Terminal();

//             if(termRef.current) {
//                 term.open(termRef.current);
//                 term.write("Connecting to container...\r\n");
//                 wsRef.current = new WebSocket("http://localhost:4010");
    
//                 wsRef.current.onopen = () => {
//                     term.write("Connected to container logs.\r\n");
//                 };
    
//                 wsRef.current.onmessage = (event) => {
//                     term.write(event.data);
//                 };
//                 wsRef.current.onclose = () => {
//                     term.write("\r\nDisconnected from container logs.\r\n");
//                 };
//             }
//         return () => {
//             term.dispose();
//             if (wsRef.current) wsRef.current.close();
//         };
//     }, []);

//     return <div ref={termRef} className="w-full h-full"></div>;
// };


const ActiveTerminals = ({terminal}) => {
   // ws setup
    // const WSL_URL = import.meta.env.VITE_WS_URL || `http://localhost:4010`
    const token = useRecoilValue(userModeSelector);
    if (!token) return <div>Not authenticated</div>;
    const userDetails = useRecoilValue(userDetailsAtom);
    const termRef = useRef(null);
    const wsRef = useRef(null);
    const term = useRef(null);
    const retryRef = useRef(0);
    let inputBuffer = "";
    
    useEffect(() => {
        term.current = new Terminal({
            cursorBlink: true,
            disableStdin: false,
            theme: {
                background:"#1E1E3F",
                foreground:"#A599E9",
            },
            rows:"30",
            scrollback:1500
        });
        const fitAddon = new FitAddon();
        term.current.loadAddon(fitAddon);

        const connectWebSocket = () => {
            if (retryRef.current >= 5) return;
            if (!termRef.current) return;
            if (termRef.current) {
                term.current.open(termRef.current);
                fitAddon.fit();
                term.current.write("Connecting to container...\r\n");
    
                // Connect to WebSocket server
                wsRef.current = new WebSocket(`http://localhost:4010?token=${token}&contId=${terminal.contDockerId}`);
    
                wsRef.current.onopen = () => {
                    retryRef.current = 0;
                    term.current.write(`User: ${userDetails.email}\r\nLogged into container: [${terminal.containerName}]\r\nAt time: ${(new Date()).toISOString()}\r\nType your commands below: (enter exit to kill shell)\r\n`);
                };
    
                wsRef.current.onmessage = (event) => {
                    term.current.write(event.data);
                };
    
                // Capture user input and send it to WebSocket
                term.current.onKey(({ key, domEvent }) => {
                    console.log(domEvent.key);
                    const isPrintable = /^[a-zA-Z0-9 .,!?_-]$/.test(key);
                    if (domEvent.key === "Enter") {
                        // console.log("Entering the command: ", input);
                        if(inputBuffer.trim()){
                            console.log("Tnput buffer befor sending is: ", inputBuffer);
                            term.current.write("\r\n");
                            wsRef.current.send(inputBuffer);
                            inputBuffer = "";
                        }
                    } else if (domEvent.key === "Backspace"){
                        if(inputBuffer){
                            term.current.write("\b \b");
                            inputBuffer = inputBuffer.slice(0,-1);
                        }
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
        <div className="rounded-lg my-10">
            <div className="text-xl text-gray-800 font-medium mt-4 mb-2">
                Terminal to service : {terminal.containerName}
            </div>
            <div ref={termRef} className="w-full h-full bg-rose-500 text-white"></div>
        </div>
    )
};

export default ActiveTerminals;
