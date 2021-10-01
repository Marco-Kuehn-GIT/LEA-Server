import fs from "fs";

import { Vector2 } from "./interfaces";

let config: ConfigData;
let worldData: WorldData;


export enum TILE_TYPE{
    WATER,
    GRASS,
    STONE,
    TREE,
    CHEST,
    BUSH,
    CRYSTAL,
    FIRE,
    VASE,
    WOOD_BLOCK,
    TRASH
}

export interface ResourceObj{
    type: TILE_TYPE,
    health: number
}

export interface WorldData{
    size: Vector2,
    ground: TILE_TYPE[][],
    object: ResourceObj[][]
}

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

export function loadWorldData() {
    let lines: string = readFile(config.worldDirectory + "/world.json");
    worldData = JSON.parse(lines);
    return worldData;
}

export function getWorldDataAsMsg(){
    //worldData
    let msgStr: string = worldData.size.x + " " + worldData.size.y + " ";

    for (const row of worldData.ground) {
        for (const tileType of row) {
            msgStr += String.fromCharCode(tileType);
        }
    }
    for (const row of worldData.object) {
        for (const tileType of row) {
            msgStr += String.fromCharCode(tileType.type);
        }
    }
    return msgStr;
}

export function getWorldGround(position: Vector2){
    return worldData.ground[position.x][position.y]
}

export function getWorldObject(position: Vector2){
    return worldData.object[position.x][position.y]
}

export function changeWorldGround(position: Vector2, type:TILE_TYPE){
    worldData.ground[position.x][position.y] = type;
}

export function changeWorldObject(position: Vector2, type:TILE_TYPE){
    if(type === TILE_TYPE.WATER){
        worldData.object[position.x][position.y].type = type;
        worldData.object[position.x][position.y].health = 4;
        return true;
    }else if(worldData.object[position.x][position.y].type === TILE_TYPE.WATER){
        worldData.object[position.x][position.y].type = type;
        worldData.object[position.x][position.y].health = 4;
        return true;
    }else{
        return false;
    }
}

export function hitWorldObject(position: Vector2): number{
    if(worldData.object[position.x][position.y].type !== TILE_TYPE.WATER){
        console.log("h: ", worldData.object[position.x][position.y].health);
        worldData.object[position.x][position.y].health -= 1;

        if(worldData.object[position.x][position.y].health <= 0){
            worldData.object[position.x][position.y].type = TILE_TYPE.WATER;
        }
        
        return worldData.object[position.x][position.y].health;
    }
    return -1;
}

export function saveWorldData(){
    fs.writeFileSync(config.worldDirectory + "/world.json", JSON.stringify(worldData));
}