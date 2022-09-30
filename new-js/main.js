import { PreLoader } from "./loader.js";
//import { Entity } from "./entity.js";
import { Tilemap } from "./tilemap.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { CharacterList } from "./character-list.js";


//Hey, x == col and y == row;



const app = new PIXI.Application({
	width: 480,
	height: 320,
	transparent: false,
	antialis: true,
	resolution: 1
});

$('.canvas').append(app.view);

var characterList = new CharacterList();
var loader;
var player;
var tilemap;
var enemy;
var enemy2;
let mode = { 'exploration': true, 'combat': false };

const MapContainer = new PIXI.Container();
const TileContainer = new PIXI.Container();
const PlayerContainer = new PIXI.Container();
const EnemyContainer = new PIXI.Container();
const Container = new PIXI.Container();

app.stage.addChild(MapContainer);
app.stage.addChild(TileContainer);
app.stage.addChild(PlayerContainer);
app.stage.addChild(EnemyContainer);
app.stage.addChild(Container);

// Load Assets
loader = new PreLoader(app);
loader.load(start);

function start(e) {

	let size = getObjectSize(e.resources);
	let keys = getObjectKeys(e.resources);

	for (let i = 0; i < size; i++) {
		loader.saveAssets({
			"name": keys[i],
			"resource": e.resources[keys[i]],
		});
	}
	console.log(loader)
	player = new Player("Börg", app, loader, PlayerContainer, tilemap, { 'x': 240, 'y': 160 });
	tilemap = new Tilemap(app, loader, MapContainer, TileContainer, { "x": player.x, 'y': player.y }, player);
	enemy = new Enemy("Orc", app, loader, EnemyContainer, tilemap, { 'x': 192, 'y': 160 });
	//enemy2 = new Enemy("SwordsmanTemplate", app, loader, EnemyContainer, tilemap, { 'x': 0, 'y': 160 });

	characterList.add(enemy);
	//characterList.add(enemy2);

	var index = 0;
	let turns = 0;
	let other_turn = true;
	player.turn = true;
	let keepWalking = false;

	//tilemap.getTile({'x':player.x, 'y': player.y})
	enemy.moveRandomly();
	//enemy2.moveRandomly();
	//console.log(enemy.path)
	enemy.detectPlayer();
	app.ticker.add((delta) => {
		//modes: exploration, combat
		if (mode.exploration) {
			// console.log('player Turn',player.turn);
			// console.log('enemy Turn',enemy.turn);
			// console.log('keepWalking',keepWalking)
			if (player.turn) {

				if (player.path.length > 0 || player.currentNode != null) {
					console.log('player.turn')
					// console.log('len',player.path.length)
					//Step
					keepWalking = player.walk(tilemap,index);

					if (!keepWalking) {
						console.log('here')
						player.turn = false;
					}

				}

				else {
					//Some other kind of interaction.
				}

			}
			else if (other_turn || keepWalking) {
				//console.log('not player turn')
				for (let i = 0; i < characterList.list.length; i++) {
					let char = characterList.list[i];
					if (char.turn) {
						let temp = char.detectPlayer();
						if(temp){
							console.log('here')
							console.log('Detected player!')
							throw 500;
						}
						else{
							console.log('else')
						}
						other_turn = true;
						console.log(char.name + ' turn')
						console.log('path len',char.path.length)
						console.log('currentNode',char.currentNode)
						if (char.path.length > 0 || char.currentNode != null) {
							console.log(char.name + ' walk')
							keepWalking = char.walk(tilemap,index);
							
							if (!keepWalking) {
								other_turn = false;
								console.log('here2')
								char.turn = false;
							}
						}
						else {
							console.log('moveRandomly')
							other_turn = false;
							char.turn = false;
							char.moveRandomly();
							console.log('after moveRandomly')
							console.log('keepWalking',keepWalking)
							console.log('other_turn',other_turn)
							for (let i = 0; i < characterList.list.length; i++) {
								console.log(characterList.list[i].name + ' turn:' + characterList.list[i].turn);
							}
						}
					}
				}

			}
			else if (!keepWalking) {
				player.turn = true;
				for(let i =0; i < characterList.list.length; i++) {
					let character = characterList.list[i];
                    character.turn = true;
				}
				other_turn = true;
				turns++;
				console.log('turns', turns)
			}

		}


	});


}
