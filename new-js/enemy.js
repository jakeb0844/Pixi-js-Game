import { Entity } from "./entity.js";
import { Pathfinding } from "./pathfinding.js";

export class Enemy extends Entity {
  constructor(name = "", app, loader, container, tilemap, position) {
    super(name, app, loader, container, tilemap, position);

    this.walking = false;
    //this.stats = { str: 10, dex: 10, hp: 10, int: 10, mp: 10 };
  }

  /*
https://www.wargamer.com/dnd/stats#:~:text=The%20six%20D%26D%20stats%20are,to%20all%20kinds%20of%20rolls.
    Stats:
        Strength
        Dex
        Constituion
        Intelligence
        Wisdom
        Charisma
 
    */
  moveRandomly() {
    let start = this.tilemap.getTile({ 'x': this.sprite.x, 'y': this.sprite.y });
    //this.tilemap.grid[start.col][start.row].enemyPosition = true;

    let min = Math.ceil(0)
    let maxY = Math.floor(480);
    let maxX = Math.ceil(320);
    let end;

    do {
      end = { "x": Math.floor(Math.random() * (maxY - min + 1)) + min, "y": Math.floor(Math.random() * (maxX - min + 1)) + min };
      end = this.tilemap.getTile({ 'x': end.x, "y": end.y });
    }
    while (end.wall)

    let di = new Pathfinding(this.tilemap.grid, start, end);
    let { visited, endNode } = di.find_path(di.grid, di.startNode, di.endNode);

    let shortest_path = di.makePath(endNode);
    shortest_path.shift();
    this.path = shortest_path;

  }

  detectPlayer() {
    //If player is 5 tiles away
    let detected = false;

    //Get 3 tiles away in every direction;

    let startNode = this.tilemap.getTile({ 'x': this.sprite.x, 'y': this.sprite.y });

    //console.log(startNode);
    //highLightRect(startNode);

    //north
    //south
    //east
    //west
    let neighbors = getNeighbors(startNode,3,this.tilemap.grid);

    for(let i = 0; i < neighbors.length; i++){
      let node = neighbors[i];
      //highLightRect(node);

      if(node.playerPosition){
        return true;
      }
    }

    return false;
  }
  startWalking() {
    this.walking = true;
  }

  stopWalking() {
    this.walking = false;
  }

  //attack
  attack(enemy) {
    let damage = this.stats.str * (100 / (100 + enemy.stats.hp));

    return damage;
  }
}