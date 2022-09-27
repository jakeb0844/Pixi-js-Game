//import {Tile} from './tile.js';
class Tile {
    constructor(row, col, rect) {
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

function CalculateRowAndCol(position) {
    let row = Math.floor(position.x / 16);
    let col = Math.floor(position.y / 16);

    return { "row": row, "col": col };
}

function CalculatePosition(row, col) {
    let x = Math.floor(row / 16) * 16;
    let y = Math.floor(col / 16) * 16;

    return { "x": x, "y": y };
}

function createRect(x, y, width, height) {
    let rect = new PIXI.Graphics()
        .beginFill(0xFFFFFFF0000)
        .lineStyle({ color: 1, width: 1, native: true })
        .drawShape({ "x": x, "y": y, "width": width, "height": height, "type": 1 });

    return rect;

}

function getObjectSize(obj) {
    return Object.keys(obj).length;
}

function getObjectKeys(obj) {
    return Object.keys(obj);
}

function createGrid(collisionLayer, tiles) {
    //console.log(collisionLayer)
    let size = 0;
    let grid = [];
    let nodes = [];

    for (let row = 0; row < collisionLayer.height; row++) {
        let arr = [];
        for (let col = 0; col < collisionLayer.width; col++) {
            let node = new Tile(row, col);

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
            nodes[size] = arr[col];
            size++;
        }

        grid.push(arr)

    }
    //console.log(grid)
    // console.log(this.grid)
    // console.log(this.nodes)
    return { 'grid': grid, 'nodes': nodes };
}

function printGrid(grid, id) {
    let height = grid.length;
    let width = grid[0].length;
    let html = '';

    let el = $('#' + id);
    el.html('');

    el.append('<table>')

    for (let col = 0; col < height; col++) {
        //el.append('<tr>')
        html = '';
        html += "<tr>";
        for (let row = 0; row < width; row++) {
            //el.append('<td>')

            if (grid[col][row].playerPosition) {
                //el.append('X')
                html += "<td style='background:yellow'>";
                html += "X";
            }
            else if (grid[col][row].action) {
                html += "<td style='background:green'>";
                html += "a";
            }
            else if (grid[col][row].enemeyPosition) {
                html += "<td style='background:pink'>";
                html += "E";
            }
            else if (!grid[col][row].wall) {
                //el.append('0')
                html += "<td style='background:lightblue'>";
                html += "0";
            }
            else {
                //el.append('1')
                html += "<td style='background:red'>";
                html += "1";
            }
            //el.append('</td>')
            html += "</td>";
        }
        //el.append('</tr>')
        html += "</tr>";
        el.append(html);

    }
    el.append('</table>')
}

function walk(entity, tilemap, index) {
    console.log('entity', entity.name);
    //console.log('len',entity.path.length)
    //let node = entity.path[index];
    if(entity.currentNode == null){
        entity.currentNode = entity.path.shift()
       // console.log('len',entity.path.length)
    }
    let node = entity.currentNode;
    let walkY = node.row * tilemap.tileWidth;
    let walkX = node.col * tilemap.tileHeight;
    let walkSpeed = 2;

    //tilemap.updateCharPosition({ "col": Math.floor(entity.sprite.y / 16), "row": Math.floor(entity.sprite.x / 16) })
    //printGrid(tilemap.grid, 'grid')

    if (entity.sprite.y != walkY) {

        if (walkY > entity.sprite.y) {
            //entity.changeAnimation(entity.animations.up);
            entity.sprite.y += walkSpeed;;
            entity.y += walkSpeed;
        }
        else {
            //entity.changeAnimation(entity.animations.down);
            entity.sprite.y -= walkSpeed;
            entity.y -= walkSpeed;
        }
    }

    else if (entity.sprite.x != walkX) {

            if (walkX > entity.sprite.x) {
                //entity.changeAnimation(entity.animations.right);
                entity.sprite.x += walkSpeed;
                entity.x += walkSpeed;
            }
            else {
                //entity.changeAnimation(entity.animations.left);
                entity.sprite.x -= walkSpeed;
                entity.x -= walkSpeed;
            }     
    }

    let x = entity.sprite.x;
    let y = entity.sprite.y;
    //console.log("x:" + x + ' and walkX:' + walkX);
    //console.log("y:" + y + ' and walkY:' + walkY);
    if (x != walkX || y != walkY) {
        //entity.path[index].tile.clear()
        console.log('keepWalking')
        return { 'index': index, 'keepWalking': true };
    }
    else {
        console.log('finished walking')
        entity.currentNode = entity.path.shift();
        //console.log('node',entity.currentNode)
        index++;
        //console.log('index',index)
        //console.log('len2',entity.path.length)
        if (entity.currentNode == undefined) {
            entity.walking = false;
            entity.path = [];
            entity.currentNode = null;
            index = 0;
            //entity.changeAnimation(entity.animations.default)
        }
    }

    return { 'index': index, "keepWalking": false };

}
//Archive
function playerWalk(player, tilemap, index) {
    if (player.walking) {
        // if (index < tilemap.path.length) {
        if (index < player.path.length) {

            // let node = tilemap.path[index];
            let node = player.path[index];
            let walkY = node.row * tilemap.tileWidth;
            let walkX = node.col * tilemap.tileHeight;
            let walkSpeed = 2;

            tilemap.updateCharPosition({ "col": Math.floor(player.sprite.y / 16), "row": Math.floor(player.sprite.x / 16) })
            printGrid(tilemap.grid, 'grid')

            if (player.sprite.y != walkY) {

                if (walkY > player.sprite.y) {
                    player.changeAnimation(player.animations.up);
                    player.sprite.y += walkSpeed;;
                    player.y += walkSpeed;
                }
                else {
                    player.changeAnimation(player.animations.down);
                    player.sprite.y -= walkSpeed;
                    player.y -= walkSpeed;
                }
            }

            else if (player.sprite.x != walkX) {

                if (player.sprite.x != walkX) {

                    if (walkX > player.sprite.x) {
                        player.changeAnimation(player.animations.right);
                        player.sprite.x += walkSpeed;
                        player.x += walkSpeed;
                    }
                    else {
                        player.changeAnimation(player.animations.left);
                        player.sprite.x -= walkSpeed;
                        player.x -= walkSpeed;
                    }

                }
                else {
                    walkX = null;
                }
            }
            else {
                player.changeAnimation(player.animations.default)
                // tilemap.path[index].tile.clear()
                player.path[index].tile.clear()
                index++

            }

        }
        else {
            player.walking = false
            // tilemap.path = [];
            player.path = [];
        }

    }
    else {
        index = 0;
    }
    return index;
}
