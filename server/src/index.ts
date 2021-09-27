import WebSocket from "ws";

import { Client } from "./client";
import { Server, MSG_TYPE } from "./server";
import { ConfigData, loadConfigData, loadPlayerData, loadWorldData, getWorldDataAsMsg } from "./data";

let config: ConfigData = loadConfigData();
loadWorldData();
console.log(getWorldDataAsMsg());



const maxConnections: number = config.maxConnections;
const serverOptions: WebSocket.ServerOptions = { 
    port: config.port
};

// Start the WebSocketServer with the serverOptions
const webSocketServer: WebSocket.Server = new WebSocket.Server(serverOptions);
const server: Server = new Server(webSocketServer);
console.log(`Started server at port ${serverOptions.port}...`);

// Set Listener for WebSocketConnections
webSocketServer.on("connection", (websocket: WebSocket) => {
    if(webSocketServer.clients.size >= maxConnections){
        server.sendMsg(websocket, MSG_TYPE.ERR, "The server is full!");
        websocket.terminate();
    }

    // Create a client
    let client =  new Client(websocket, server, "Player_" + Math.floor(Math.random() * 1000));

    console.log(`${client.name} connected!`);
    console.log(`Player connected: ${webSocketServer.clients.size}`);
});

