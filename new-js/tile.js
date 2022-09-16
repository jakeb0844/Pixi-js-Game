class Tile{
    constructor(row,col,rect) {
        this.row = row;
        this.col = col;
        this.parent = null;
        this.distance = Infinity;
        this.visited = false;
        this.wall = false;
        this.rect = rect;
        this.playerPosition = false;
        this.enemeyPosition = false;
    }

    
}