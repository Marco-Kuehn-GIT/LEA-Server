export class Data{

    constructor(){

    }

    checkLogin(){

    }

    getWorldData(): NetworkObjet[]{
        return [new NetworkObjet(0, "")];
    }
}

export class NetworkType{
    toMsgFormat(): string{
        return "";
    }
}

export class NetworkObjet extends NetworkType{

    id: number;
    name: string;

    constructor(id: number, name: string){
        super();
        this.id = id;
        this.name = name;
    }

    toMsgFormat(): string{
        return "";
    }
}

export class NetworkPlayer extends NetworkType{
    
    health: number = 100;
    maxHealth: number = 100;

    inventory: Item[] = [];

    
}

export class NetworkItem extends NetworkType{
    
    id: number;

    constructor(id: number){
        super();
        this.id = id;
    }
}