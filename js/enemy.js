class Enemy{
    constructor(name,game,container,position) {
        this.name = name;
        this.game = game;
        this.container = container;
        this.x = position.x;
        this.y = position.y;
        this.sprite;
        this.animations = [];
        
    }
}