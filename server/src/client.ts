import WebSocket from "ws";

import { Server, MSG_TYPE } from "./server";
import { Vector2 } from "./interfaces";
import { Inventory } from "./inventory";
import * as Data from "./data";

export class Client {
    public websocket: WebSocket;
    public id: string;
    public name: string;
    public clientList: Client[];
    public skin: number;
    public position: Vector2;
    public inventory: Inventory;

    private server: Server;

    constructor(
        websocket: WebSocket,
        server: Server,
        id: string,
        name: string,
        clientList: Client[],
        position: Vector2 = { x: 0, y: 0 },
        inventory: Inventory = new Inventory()
    ) {
        this.websocket = websocket;
        this.server = server;
        this.id = id;
        this.name = name;
        this.clientList = clientList;
        this.position = position;
        this.inventory = inventory;

        this.skin = Math.floor(Math.random() * 4);

        // Set event handler
        websocket.on("close", (code: number, reason: string) => {
            console.log("Client has disconnected!");
            this.clientList.splice(clientList.indexOf(this));
            server.sendMsgToAllExcept(
                this.websocket,
                MSG_TYPE.DESPAWN,
                this.id
            );
        });

        websocket.on("error", (err: Error) => {
            console.log(`ERR: ${err}`);
        });

        websocket.on("message", (data: WebSocket.Data) => {
            let msgType: number = data.toString().charCodeAt(0);
            let msgStr: string = data.toString().substring(1);
            let msgArr: string[] = [];

            switch (msgType) {
                case MSG_TYPE.ADD_RESOURCE:
                    console.log("ADD",msgStr);
                    
                    msgArr = msgStr.split(" ");
                    if(Data.changeWorldObject({x: parseInt(msgArr[1]), y: parseInt(msgArr[2])}, parseInt(msgArr[0]))){
                        server.sendMsgToAll(MSG_TYPE.ADD_RESOURCE, msgStr);
                    }
                    break;
                case MSG_TYPE.HIT_RESOURCE:
                    console.log("HIT_RESOURCE " + msgStr);
                    
                    msgArr = msgStr.split(" ");
                    let health = Data.hitWorldObject({x: parseInt(msgArr[0]), y: parseInt(msgArr[1])});
                    console.log("health " + health);
                    if(health === 0){
                        server.sendMsgToAll(MSG_TYPE.ADD_RESOURCE, Data.TILE_TYPE.WATER + " " + msgArr[1] + " " + msgArr[2]);
                        Data.changeWorldObject({x: parseInt(msgArr[0]), y: parseInt(msgArr[1])}, Data.TILE_TYPE.WATER);
                    }else if(health >= 0){
                        server.sendMsgToAll(MSG_TYPE.HIT_RESOURCE, msgArr[1] + " " + msgArr[2] + " " + health);
                    }
                    break;
                case MSG_TYPE.REMOVE_RESOURCE:
                    msgArr = msgStr.split(" ");
                    if(Data.changeWorldObject({x: parseInt(msgArr[0]), y: parseInt(msgArr[1])}, Data.TILE_TYPE.WATER)){
                        server.sendMsgToAll(MSG_TYPE.REMOVE_RESOURCE, msgStr);
                    }
                    break;

                case MSG_TYPE.CHAT:
                    console.log(`Msg(${MSG_TYPE[msgType]}) form ${this.name}`);
                    server.sendMsgToAllExcept(
                        this.websocket,
                        MSG_TYPE.CHAT,
                        this.name + ": " + msgStr
                    );
                    break;
                case MSG_TYPE.MOVE:
                    msgArr = msgStr.split(" ");
                    this.position = {
                        x: parseFloat(msgArr[0]),
                        y: parseFloat(msgArr[1])
                    };
                    server.sendMsgToAllExceptInRange(
                        this,
                        MSG_TYPE.MOVE,
                        this.id + " " + msgStr
                    );
                    break;
                case MSG_TYPE.AUTH:{
                    server.sendMsg(
                        this.websocket,
                        MSG_TYPE.INIT,
                        this.skin + ""
                    );

                    server.sendMsgToAllExcept(
                        this.websocket,
                        MSG_TYPE.SPAWN,
                        this.id + " " + this.skin + " " + this.name
                    );

                    for (const client of clientList) {
                        if(this === client) continue;
                        server.sendMsg(
                            this.websocket,
                            MSG_TYPE.SPAWN,
                            client.id + " " + client.skin + " " + client.name
                        );
                    }

                    // Send init msg
                    server.sendMsg(
                        this.websocket,
                        MSG_TYPE.SET_WORLD,
                        Data.getWorldDataAsMsg()
                    );
                }
            }
        });
    }
}
