import WebSocket from "ws";
import { Client } from "./client";

export enum MSG_TYPE {
    AUTH,
    INIT,
    SET_WORLD,
    ADD_RESOURCE,
    REMOVE_RESOURCE,
    HIT_RESOURCE,
    CHAT,
    SPAWN,
    DESPAWN,
    MOVE,
    ERR
}

export class Server{

    webSocketServer: WebSocket.Server;
    clientList: Client[];

    constructor(webSocketServer: WebSocket.Server, clientList: Client[]){
        this.webSocketServer = webSocketServer;
        this.clientList = clientList;
    }

    // Send a msg to the client
    sendMsg(webSocket: WebSocket, msgType: MSG_TYPE, msg: string): void{
        // console.log(`Send msg : ${msg}`);
        
        webSocket.send(Buffer.from(String.fromCharCode(msgType) + msg, "utf8"));
    }

    // Send a msg to all clients
    sendMsgToAll(msgType: MSG_TYPE, msg: string): void{
        this.webSocketServer.clients.forEach((webSocket) => {
            this.sendMsg(webSocket, msgType, msg);
        });
    }

    // Send a msg to the client except webSocket
    sendMsgToAllExcept(exceptWebSocket: WebSocket, msgType: MSG_TYPE, msg: string): void{
        this.webSocketServer.clients.forEach((webSocket) => {
            if(webSocket != exceptWebSocket) this.sendMsg(webSocket, msgType, msg);
        });
    }

    // Send a msg to the client except webSocket in his range
    sendMsgToAllExceptInRange(exceptClient: Client, msgType: MSG_TYPE, msg: string): void{
        for (let index = 0; index < this.clientList.length; index++) {
            const client = this.clientList[index];
            if(
                client !== exceptClient && 
                client.position.x < exceptClient.position.x + 15 &&
                client.position.x > exceptClient.position.x - 15 &&
                client.position.y < exceptClient.position.y + 15 &&
                client.position.y > exceptClient.position.y - 15
            ){
                this.sendMsg(client.websocket, msgType, msg);
            }
            
        }
    }
}