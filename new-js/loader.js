

export class PreLoader {
    constructor(app) {
        // this.app = app;
        this.assets = [];
        this.completed = false;
    }

    load(callback) {
        const loader = PIXI.Loader.shared;
        const baseUrl = "/assets/";
        //loader.baseUrl = "./assets/";

        loader.add("Börg.json")
            .add('mapJson',baseUrl + "maps/map.json")
            .add('map', baseUrl + "maps/map.png")
            .add('Orc.png', "/assets/sprites/Characters/Monsters/Orcs/Orc.png")
            .add('SwordsmanTemplate.png', "/assets/sprites/Characters/Soldiers/Melee/SwordsmanTemplate.png")

        loader.onProgress.add(this.progress);
        loader.onComplete.add(this.complete);
        loader.onError.add(this.error);

        loader.load(callback);
    }

    progress(e) {
        //console.log(e)
    }

    complete(e) {
        //console.log(e)
    }

    error(e) {

    }

    saveAssets(asset){
        this.assets.push(asset);
    }

    getAsset(name){
        return this.assets.find(asset => asset.name === name);
    }
}