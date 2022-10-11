import { PreLoader } from "./loader.js";
//import { Entity } from "./entity.js";
import { Tilemap } from "./tilemap.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { CharacterList } from "./character-list.js";
import { Pathfinding } from "./pathfinding.js";


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

//let characterList = new CharacterList();
app.characterList = new CharacterList();

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
	enemy2 = new Enemy("SwordsmanTemplate", app, loader, EnemyContainer, tilemap, { 'x': 0, 'y': 160 });
	console.log(player.sprite.position)
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
	let temp = false;

	app.ticker.add((delta) => {
		//modes: exploration, combat

		if (nodesToClear.length > 0) {
			for (let i = 0; i < nodesToClear.length; i++) {
				nodesToClear[i].tile.clear();
			}
			nodesToClear = [];
		}

		if (app.game.mode == 'exploration') {

			let obj = explorationPhase(player, turns, other_turn, keepWalking, app.characterList, tilemap, app.game.mode)
			turns = obj.turns;
			other_turn = obj.other_turn;
			keepWalking = obj.keepWalking;
			app.game.mode = obj.mode;

			if (app.game.mode != 'exploration') {
				temp = true;
			}


		}
		else {

			//console.log(player.turn)

			if (temp) {
				player.centerEntityInTile();
				enemy.centerEntityInTile();
				player.currentNode = null;
				player.path = [];
				player.stopWalking()
				player.turn = true;
				other_turn = true;
				keepWalking = false;
				temp = false;
				enemy.path = [];
			}

			if (player.turn) {
				//console.log('Attack Player turn');

				//Mortal Combbbbatttt!
				$('#text').text('Combat')
				if (app.game.combatChoice != '') {
					$('#text').text(app.game.combatChoice)
					// player.currentNode = null;
					// player.path = [];
					// player.stopWalking()
					// player.turn = true;
					// other_turn = true;
					// keepWalking = false;
					if (app.game.combatChoice == "walk") {
						//Show tiles you can walk to;

						let startNode = tilemap.getTile({ 'x': player.sprite.x, 'y': player.sprite.y });
						let neighbors = getNeighbors(startNode, 1, tilemap.grid);
						player.neighbors = neighbors;

						for (let i = 0; i < neighbors.length; i++) {
							if(!neighbors[i].enemyPosition){
								highLightRect(neighbors[i]);
							nodesToClear.push(neighbors[i]);
							}
							
						}

						//console.log(player.path.length)
						if (player.combatPath != null) {
							if(!player.combatPath.enemyPosition){
								console.log(player.combatPath)
								keepWalking = player.walk(tilemap, player.combatPath);
							if (!keepWalking) {
								player.combatPath = null;
								player.turn = false;
							}
							}
							
						}


						
						//app.game.combatChoice = '';

					}
					else if (app.game.combatChoice == 'attack') {
						$('#text').text(app.game.combatChoice)
						console.log('attacking')
						let startNode = tilemap.getTile({ 'x': player.sprite.x, 'y': player.sprite.y });
						let neighbors = getNeighbors(startNode, 2, tilemap.grid);
						player.neighbors = neighbors;


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
								player.turn = false;

							}
							else {
								console.log("can't attack there, no enemy in that tile.")
								player.attackNode = null;
							}

						}
						
						//app.game.combatChoice = '';
					}



				}
			}
			else if (other_turn || keepWalking) {
				//other_turn = false;
				//for(let i = 0; i < )
				for (const enemy of app.characterList.list) {
					if (enemy.turn) {
						let shortest_path = [];
						//Find character.
						if(!keepWalking){

						console.log('finding shortest path')
						let end = tilemap.getTile({ 'x': player.sprite.x, 'y': player.sprite.y });
						let start = tilemap.getTile({ 'x': enemy.sprite.x, 'y': enemy.sprite.y });
						let di = new Pathfinding(tilemap.grid, start, end);
						let { visited, endNode } = di.find_path(di.grid, di.startNode, di.endNode);

						shortest_path = di.makePath(endNode);
						shortest_path.shift();

						console.log(shortest_path)
						if(shortest_path.length > 1){
							enemy.path = [shortest_path[0]];
						}
						else{
							enemy.path = [];
						}
						
						console.log("enemy path",enemy.path)
						console.log("enemy path length",enemy.path.length)
						}


						
						if(shortest_path.length > 1 || enemy.path.length > 0){
							console.log('walking')
							keepWalking = enemy.walk(tilemap,[enemy.path[0]])
							console.log('keepWalking', keepWalking)
						}
						else{
							enemy.path = [];
							//attack
							let damage = enemy.attack(player);
							player.stats.health -= damage;
							$('#p-health').text(player.stats.health)
							keepWalking = false;

							if(player.stats.health <= 0){
								//player died
								app.ticker.stop();
								alert('Game Over!')
								
							}

						}

						if(keepWalking){
							enemy.turn = true;
						}
						else{
							enemy.turn = false;
						}
					
						

					}
				}
				other_turn = false;
			}
			else if (!keepWalking) {
				player.turn = true;
				for (let i = 0; i < app.characterList.list.length; i++) {
					let character = app.characterList.list[i];
					character.turn = true;
				}
				other_turn = true;
				turns++;
				console.log('turns', turns)
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

