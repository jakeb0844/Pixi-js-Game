class Node{
    constructor(row,col,tile) {
        this.row = row;
        this.col = col;
        this.parent = null;
        this.distance = Infinity;
        this.visited = false;
        this.wall = false;
        this.tile = tile;
    }

    
}