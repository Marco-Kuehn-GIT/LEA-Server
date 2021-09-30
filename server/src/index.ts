import WebSocket from "ws";

import { Client } from "./client";
import { Server, MSG_TYPE } from "./server";
import * as Data from "./data";

let config: Data.ConfigData = Data.loadConfigData();
Data.loadWorldData();



const maxConnections: number = config.maxConnections;
const serverOptions: WebSocket.ServerOptions = { 
    port: config.port
};

// Start the WebSocketServer with the serverOptions
const webSocketServer: WebSocket.Server = new WebSocket.Server(serverOptions);

let clientList: Client[] = [];
const server: Server = new Server(webSocketServer, clientList);
console.log(`Started server at port ${serverOptions.port}...`);


// Set Listener for WebSocketConnections
webSocketServer.on("connection", (websocket: WebSocket) => {
    if(webSocketServer.clients.size >= maxConnections){
        server.sendMsg(websocket, MSG_TYPE.ERR, "The server is full!");
        websocket.terminate();
    }

    // Create a client
    let client =  new Client(websocket, server, createId(), "Player_" + Math.floor(Math.random() * 1000), clientList);

    clientList.push(client);

    console.log(`${client.name} connected!`);
    console.log(`Player connected: ${webSocketServer.clients.size}`);
});

function createId(): string{
    let uID = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    return uID;
}