import { PreLoader } from "./loader.js";
//import { Entity } from "./entity.js";
import { Tilemap } from "./tilemap.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { CharacterList } from "./character-list.js";


//Hey, x == col and y == row;
let res;

if (navigator.platform == "MacIntel") {
	res = 1.2;
}
else {
	res = 1.5;
}


const app = new PIXI.Application({
	width: 480,
	height: 320,
	transparent: false,
	antialis: true,
	resolution: res
});

$('.canvas').append(app.view);

var characterList = new CharacterList();
app.characterList = characterList;

var loader;
var player;
var tilemap;
var enemy;
var enemy2;

//app.mode = 'exploration';

app.game = { 'mode': 'exploration', 'combatChoice': '' }

//app.mode.combatChoice = '';

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
	player.tilemap = tilemap;
	enemy = new Enemy("Orc", app, loader, EnemyContainer, tilemap, { 'x': 160, 'y': 160 });
	//enemy2 = new Enemy("SwordsmanTemplate", app, loader, EnemyContainer, tilemap, { 'x': 0, 'y': 160 });

	$('#p-health').text(player.stats.health)
	$('#e-health').text(enemy.stats.health)


	console.log(app.characterList)
	//characterList.add(enemy);
	//characterList.add(enemy2);

	let turns = 0;
	let other_turn = true;
	player.turn = true;
	let keepWalking = false;
	let choice = "";
	let nodesToClear = [];

	app.ticker.add((delta) => {
		//modes: exploration, combat

		if (nodesToClear.length > 0) {
			for (let i = 0; i < nodesToClear.length; i++) {
				nodesToClear[i].tile.clear();
			}
			nodesToClear = [];
		}

		if (app.game.mode == 'exploration') {

			let obj = explorationPhase(player, turns, other_turn, keepWalking, characterList, tilemap, app.game.mode)
			turns = obj.turns;
			other_turn = obj.other_turn;
			keepWalking = obj.keepWalking;
			app.game.mode = obj.mode;


		}
		else {
			player.centerEntityInTile();
			enemy.centerEntityInTile();

			//Mortal Combbbbatttt!
			$('#text').text('Combat')
			if (app.game.combatChoice != '') {
				$('#text').text(app.game.combatChoice)
				player.currentNode = null;
				player.path = [];
				player.stopWalking()
				player.turn = true;
				other_turn = true;
				keepWalking = false;
				if (app.game.combatChoice == "walk") {
					//Show tiles you can walk to;
					let startNode = tilemap.getTile({ 'x': player.sprite.x, 'y': player.sprite.y });
					let neighbors = getNeighbors(startNode, 1, tilemap.grid);
					//console.log(player.path.length)
					if(player.combatPath != null){
						console.log('here')
						player.walk(tilemap,player.combatPath);
						player.combatPath = null;
					}
					

					for (let i = 0; i < neighbors.length; i++) {
						highLightRect(neighbors[i]);
						nodesToClear.push(neighbors[i]);
					}
				}
				else if (app.game.combatChoice == 'attack') {
					let startNode = tilemap.getTile({ 'x': player.sprite.x, 'y': player.sprite.y });
					let neighbors = getNeighbors(startNode, 5, tilemap.grid);



					for (let i = 0; i < neighbors.length; i++) {
						highLightRect(neighbors[i]);
						nodesToClear.push(neighbors[i]);
					}
					if (player.attackNode != null) {
						highLightRect(player.attackNode, 'blue')
						//console.log(player.attackNode);

						if (player.attackNode.enemyPosition) {
							console.log('Attacking enemy!')
							console.log(player.attackNode)
							let enemy = player.attackNode.enemy;
							let damage = player.attack(enemy);
							//player.stats.health -= damage;
							enemy.stats.health -= damage;

							$('#e-health').text(enemy.stats.health)

							if (enemy.stats.health <= 0) {
								enemy.destroy();
								enemy = null;
								app.game.mode = 'exploration';
								app.game.combatChoice = '';
							}

							player.attackNode = null;

						}
						else {
							console.log("can't attack there, no enemy in that tile.")
							player.attackNode = null;
						}

					}
				}

			}
		}


	});

	$('#attack').click(function () {
		app.game.combatChoice = 'attack';
	});

	$('#walk').click(function () {
		app.game.combatChoice = 'walk';
	});


}

