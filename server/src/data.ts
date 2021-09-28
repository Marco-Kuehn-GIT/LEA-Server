import fs from "fs";

import { Vector2 } from "./interfaces";

let config: ConfigData;
let worldData: WorldData;


export enum TILE_TYPE{
    WATER,
    GRASS,
    STONE,
    TREE
}

export interface WorldData{
    size: Vector2,
    ground: TILE_TYPE[][],
    object: TILE_TYPE[][]
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
            msgStr += String.fromCharCode(tileType);
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
    worldData.object[position.x][position.y] = type;
}

export function saveWorldData(){
    fs.writeFileSync(config.worldDirectory + "/world.json", JSON.stringify(worldData));
}