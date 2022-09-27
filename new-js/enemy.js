import { Entity } from "./entity.js";
import { Pathfinding } from "./pathfinding.js";

export class Enemy extends Entity {
  constructor(name = "", app, loader, container, tilemap, position) {
    super(name, app, loader, container, tilemap, position);

    this.walking = false;
    this.stats = { str: 10, dex: 10, hp: 10, int: 10, mp: 10 };
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
    //console.log(start)

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

    // endNode.tile.clear()
    // .lineStyle({ color: 0xaaaa, width: 1, native: true })
    // .drawShape({ "x": endNode.col * 16, "y": endNode.row * 16, "width": 16, "height": 16, "type": 1 });


    let shortest_path = di.makePath(endNode);
    shortest_path.shift();
    this.path = shortest_path;
    //console.log(shortest_path)

    // for (const node of shortest_path) {
    //   let tile = node.tile;
    //   tile.clear()
    //     .lineStyle({ color: 0xaaaa, width: 1, native: true })
    //     .drawShape({ "x": node.col * 16, "y": node.row * 16, "width": 16, "height": 16, "type": 1 });
    //   //this.rectsToClear.push(tile);
    // }

    //console.log(this.tilemap.find_path(startingPosition, end));



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