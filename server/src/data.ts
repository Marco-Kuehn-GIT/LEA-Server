import fs, { readFileSync } from "fs";

let config: ConfigData;

export interface ConfigData{
    port: number,
    maxConnections: number,
    worldDirectory: string
}

export function readFile(name: string){
    let path: fs.PathOrFileDescriptor = name;

    try {
        let buffer: Buffer = fs.readFileSync(path);
        
        return buffer.toString();
    } catch (error) {
        return "";
    }
}

export function loadConfigData() {
    let lines: string = readFile("server-conf.json");
    config = JSON.parse(lines);
    return config;
}

export function loadPlayerData(name: string) {
    let lines: string = readFile(config.worldDirectory + "/player/" + name + ".json");
    return JSON.parse(lines);
}

export class Data {
    constructor() {}

    checkLogin() {}

    getWorldData(): NetworkObjet[] {
        return [new NetworkObjet(0, "")];
    }
}

export class NetworkType {
    toMsgFormat(): string {
        return "";
    }
}

export class NetworkObjet extends NetworkType {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        super();
        this.id = id;
        this.name = name;
    }

    toMsgFormat(): string {
        return "";
    }
}

export class NetworkPlayer extends NetworkType {
    health: number = 100;
    maxHealth: number = 100;

}

export class NetworkItem extends NetworkType {
    id: number;

    constructor(id: number) {
        super();
        this.id = id;
    }
}
