import WebSocket from "ws";

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

    constructor(webSocketServer: WebSocket.Server){
        this.webSocketServer = webSocketServer;
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
}