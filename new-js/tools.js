function CalculateRowAndCol(position){
    let row = Math.floor(position.x / 16);
    let col = Math.floor(position.y / 16);

    return {"row":row,"col":col};
}

function CalculatePosition(row,col){
    let x = Math.floor(row / 16) * 16;
    let y = Math.floor(col / 16) * 16;

    return {"x":x, "y":y};
}

function createRect(x,y,width,height){
    let rect = new PIXI.Graphics()
    .beginFill(0xFFFFFFF0000)
    .lineStyle({ color: 1, width: 1, native: true })
    .drawShape({ "x": x, "y": y, "width": width, "height": height, "type": 1 });

    return rect;

}

function getObjectSize(obj){
    return Object.keys(obj).length;
}

function getObjectKeys(obj){
    return Object.keys(obj);
}

function createGrid(collisionLayer,tiles) {
    //console.log(collisionLayer)
    let size = 0;
    let grid = [];

    for (let row = 0;row < collisionLayer.height;row++) {
        let arr = [];
        for (let col = 0; col < collisionLayer.width; col++) {
            let node = new Node(row, col);
            
            if (collisionLayer.data[size] == 0) {
                node.wall = false;
                node.tile = tiles[size]
            }
            else {
                //this.mapArr[col][row] = 1
                node.wall = true;
                node.tile = tiles[size]
            }
            arr[col] = node;
            this.nodes[size] = arr[col];
            size++;
        }
        
        this.grid.push(arr)

    }

    // console.log(this.grid)
    // console.log(this.nodes)

}