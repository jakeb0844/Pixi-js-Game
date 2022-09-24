import { Entity } from "./entity.js";

export class Enemy extends Entity {
    constructor(name = "", app,loader,  container, tilemap, position) {
      super(name, app, loader, container, tilemap, position);
  
      this.walking = false;
      this.stats = { str: 10, dex: 10, hp: 10, int: 10, mp: 10 };
      this.route = [];
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