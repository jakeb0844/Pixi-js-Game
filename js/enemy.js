class Enemy extends Character {
  constructor(name, loader, app, container, tilemap, position) {
    super(name, loader, app, container, tilemap, position);
    // this.name = name;
    // this.game = game;
    // this.container = container;
    // this.characterObject = charObject;
    // this.tilemap;
    this.walking = false;
    this.path = [];

    this.stats = { str: 5, dex: 10, hp: 10, int: 10, mp: 10 };
  }

  //Detect player

  //attack
  attack(enemy) {
    let damage = this.stats.str * (100 / (100 + enemy.hp));

    return damage;
  }
}
