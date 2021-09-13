import WebSocket from "ws";

import { Server, MSG_TYPE } from "./server";

export class Client {

    public websocket: WebSocket;
    public name: String;

    private server: Server;

    constructor(websocket: WebSocket, server: Server, name: string){
        this.websocket = websocket;
        this.server = server;
        this.name = name;

        // Set event handler
        websocket.on("close", (code: number, reason: string) => {
            console.log("Client has disconnected!");
        });
    
        websocket.on("error", (err: Error) => {
            console.log(`ERR: ${err}`);
        });
    
        websocket.on("message", (data: WebSocket.Data) =>{
            let msgType: number = data.toString().charCodeAt(0);
            console.log(`Msg(${MSG_TYPE[msgType]}) form ${this.name}`);

            switch(msgType){
                case MSG_TYPE.CHAT:
                    server.sendMsgToAll(MSG_TYPE.CHAT, data.toString());
                    break;
            }
        });
    }

}