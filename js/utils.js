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