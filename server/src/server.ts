import WebSocket from "ws";

export enum MSG_TYPE {
    "AUTH",
    "INIT",
    "CHAT",
    "CHANGE_TRANSFORM",
    "ERR"
}

export class Server{

    webSocketServer: WebSocket.Server;

    constructor(webSocketServer: WebSocket.Server){
        this.webSocketServer = webSocketServer;
    }

    // Send a msg to the client
    sendMsg(webSocket: WebSocket, msgType: MSG_TYPE, msg: string): void{
        console.log(`Send msg : ${msg}`);
        
        webSocket.send(Buffer.from(String.fromCharCode(msgType) + msg, "utf8"));
    }

    // Send a msg to the client
    sendMsgToAll(msgType: MSG_TYPE, msg: string): void{
        this.webSocketServer.clients.forEach((webSocket) => {
            this.sendMsg(webSocket, msgType, msg);
        });
    }
}