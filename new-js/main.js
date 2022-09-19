import { PreLoader } from "./loader.js";
//import { Entity } from "./entity.js";
import { Tilemap } from "./tilemap.js";
import { Player } from "./player.js";
// import { Enemy } from "./enemy.js";

const app = new PIXI.Application({
    width: 480,
    height: 320,
    transparent: false,
    antialis: true,
    resolution: 1
});

document.body.appendChild(app.view);

var loader;
var player;
var tilemap;

const MapContainer = new PIXI.Container();
const TileContainer = new PIXI.Container();
const PlayerContainer = new PIXI.Container();
const EnemyContainer = new PIXI.Container();
const Container = new PIXI.Container();

app.stage.addChild(MapContainer);
app.stage.addChild(TileContainer);
app.stage.addChild(PlayerContainer);


// Load Assets
loader = new PreLoader(app);
loader.load(start);


function start(e) {

    let size = getObjectSize(e.resources)
    let keys = getObjectKeys(e.resources);

    for (let i = 0; i < size; i++) {
        loader.saveAssets({
            "name": keys[i],
            "resource": e.resources[keys[i]],
        });
    }
    console.log(loader)
    player = new Player("Börg",app,loader,PlayerContainer,tilemap,{'x':240, 'y':160});
    tilemap = new Tilemap(app,loader,MapContainer,TileContainer,{"x":player.x, 'y':player.y});




}
