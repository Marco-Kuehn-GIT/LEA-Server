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
    WOOD_Wall,
    WOOD_BLOCK,
    WATER_L,
    WATER_R,
    WATER_T,
    WATER_B,
    WATER_TL,
    WATER_TR,
    WATER_BL,
    WATER_BR,
    WATER_C_TL,
    WATER_C_TR,
    WATER_C_BL,
    WATER_C_BR,
    SAND
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
    let objectMsgString: string = "";

    for (let x = 0; x < worldData.size.x; x++) {
        for (let y = 0; y < worldData.size.y; y++) {
            msgStr += String.fromCharCode(worldData.ground[x][y]);

            objectMsgString += String.fromCharCode(x);
            objectMsgString += String.fromCharCode(y);
            objectMsgString += String.fromCharCode(worldData.object[x][y].type);
            objectMsgString += String.fromCharCode(worldData.object[x][y].health);
        }
    }
    return msgStr + objectMsgString;
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

export function changeWorldObject(position: Vector2, type:TILE_TYPE, newHealth: number = 4){
    if(position.x < 0 || position.y < 0 || position.x >= worldData.size.x || position.y >= worldData.size.y){
        return false;
    }

    if(worldData.ground[position.x][position.y] === TILE_TYPE.WATER){
        return false;
    }

    if(type === TILE_TYPE.WATER){
        worldData.object[position.x][position.y].type = type;
        worldData.object[position.x][position.y].health = newHealth;
        return true;
    }else if(worldData.object[position.x][position.y].type === TILE_TYPE.WATER){
        worldData.object[position.x][position.y].type = type;
        worldData.object[position.x][position.y].health = newHealth;
        return true;
    }else{
        return false;
    }
}

export function hitWorldObject(position: Vector2): number{
    if(position.x < 0 || position.y < 0 || position.x >= worldData.size.x || position.y >= worldData.size.y){
        return -1;
    }

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