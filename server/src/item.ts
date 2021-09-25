export enum ITEM_TYPE{
    "AXE",
    "PICKAXE",
    "WOOD",
    "STONE",
    "IRON"
}

export interface Item{
    type: ITEM_TYPE,
    maxStack: number,
    number: number
}