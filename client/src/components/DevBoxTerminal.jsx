import React, { useEffect, useRef } from "react";


const DevBoxTerminal = () => {
    // const terminalRef = useRef(null);
    // const socketRef = useRef(null);
    // const termRef = useRef(null);
    // const fitAddonRef = useRef(null);
    // const WS_URL = "ws://localhost:5000";
    // useEffect(() => {
    //     if (!terminalRef.current) return;

    //     // Initialize xterm.js terminal
    //     const term = new Terminal({
    //         cursorBlink: true,
    //         fontSize: 14,
    //         theme: {
    //           background: "#1e1e1e",
    //           foreground: "#ffffff",
    //         },
    //     });

    //     const fitAddon = new FitAddon();
    //     term.loadAddon(fitAddon);
    //     term.open(terminalRef.current);
    //     fitAddon.fit();

    //     // Initialize WebSocket connection
    //     const socket = new WebSocket(WS_URL);

    //     socket.onopen = () => {
    //       term.write("\r\n\x1b[32mConnected to DevBox Terminal\x1b[0m\r\n");
    //     };

    //     socket.onmessage = (event) => {
    //       term.write(event.data); // Print messages from backend
    //     };

    //     socket.onerror = (error) => {
    //       console.error("WebSocket Error:", error);
    //       term.write("\r\n\x1b[31mWebSocket Error!\x1b[0m\r\n");
    //     };

    //     socket.onclose = () => {
    //       term.write("\r\n\x1b[31mConnection Closed\x1b[0m\r\n");
    //     };

    //     // Send user input to backend WebSocket
    //     term.onData((data) => {
    //       if (socket.readyState === WebSocket.OPEN) {
    //             socket.send(data);
    //     }
    //     });

    //     // Cleanup on unmount
    //     termRef.current = term;
    //     socketRef.current = socket;
    //     fitAddonRef.current = fitAddon;

    //     return () => {
    //       term.dispose();
    //       socket.close();
    //     };
    // }, []);
    // return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
    return <>hello devterminal component</>
}

export default DevBoxTerminal;