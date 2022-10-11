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
        //this.enemyPosition = false;
        this.enemy = null;
    }

}

function CalculateRowAndCol(position) {
    let row = Math.floor(position.x / 16);
    let col = Math.floor(position.y / 16);

    return { "row": row, "col": col };
}

function CalculatePosition(row, col) {
    
    let x = row * 16;
    let y = col * 16;
    
    
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
            else if (grid[col][row].enemy != null) {
                //console.log(grid[col][row])
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
    if (entity.currentNode == null) {
        entity.currentNode = entity.path.shift()
        // console.log('len',entity.path.length)
    }
    let node = entity.currentNode;
    let walkY = node.row * tilemap.tileWidth;
    let walkX = node.col * tilemap.tileHeight;
    let walkSpeed = 2;

    tilemap.updateCharPosition({ "col": Math.floor(entity.sprite.y / 16), "row": Math.floor(entity.sprite.x / 16) })
    printGrid(tilemap.grid, 'grid')

    if (entity.sprite.y != walkY) {

        if (walkY > entity.sprite.y) {
            entity.changeAnimation(entity.animations.up);
            entity.sprite.y += walkSpeed;;
            entity.y += walkSpeed;
        }
        else {
            entity.changeAnimation(entity.animations.down);
            entity.sprite.y -= walkSpeed;
            entity.y -= walkSpeed;
        }
    }

    else if (entity.sprite.x != walkX) {

        if (walkX > entity.sprite.x) {
            entity.changeAnimation(entity.animations.right);
            entity.sprite.x += walkSpeed;
            entity.x += walkSpeed;
        }
        else {
            entity.changeAnimation(entity.animations.left);
            entity.sprite.x -= walkSpeed;
            entity.x -= walkSpeed;
        }
    }

    let x = entity.sprite.x;
    let y = entity.sprite.y;
    //console.log("x:" + x + ' and walkX:' + walkX);
    //console.log("y:" + y + ' and walkY:' + walkY);
    if (x != walkX || y != walkY) {

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
            entity.changeAnimation(entity.animations.default)

        }
    }

    return { 'index': index, "keepWalking": false };

}

function highLightRect(node, color = "red") {
    let colors = {
        'red': 0xfc0202,
        'green': 0x00ff00,
        'yellow': 0xffff00,
        'blue': 0x0000ff,
        'black': 0x000000,
        'purple': 0xa020f0,
        'orange': 0xffa500,
    };
    //console.log('color',colors)
    //console.log('color',colors[color])
    let r = node.tile;
    let tileWidth = 16;
    let tileHeight = 16;
    r.clear();
    r.lineStyle({ color: colors[color], width: 1, native: true })
    r.drawShape({ "x": node.col * tileHeight, "y": node.row * tileWidth, "width": tileWidth, "height": tileHeight, "type": 1 })

}

function getNeighbors(node, length, grid) {
    let neighbors = [];
    let row = node.row;
    let col = node.col;

    for (let i = 0; i < length; i++) {

        //previous
        if (row !== 0) {
            if (row - (i + 1) >= 0) {
                if(!grid[row - (i + 1)][col].wall){
                    neighbors.push(grid[row - (i + 1)][col])
                }
                
                
            }
        }

        //Get next
        if (row !== grid.length - 1) {
            if (row + (i + 1) <= grid.length - 1) {
                if(!grid[row + (i + 1)][col].wall){
                    neighbors.push(grid[row + (i + 1)][col])
                }
                
            }
        }
        //get up
        if (col !== 0) {
            if (col - (i + 1) >= 0) {
                if(!grid[row][col - (i + 1)].wall){
                    neighbors.push(grid[row][col - (i + 1)])
                }
            }
        }

        //get down
        if (col !== grid[0].length - 1) {
            if (col + (i + 1) <= grid[0].length - 1) {
                if(!grid[row][col + (i+1)].wall){
                    neighbors.push(grid[row][col + (i + 1)])
                }
            }
        }

    }

    if (neighbors.length > 0) {
        return neighbors;
    }
    else {
        return [];
    }
}


function explorationPhase(player, turns, other_turn, keepWalking, characterList, tilemap, mode) {
    // console.log('player',player.turn)
    // console.log('other_turn',other_turn)
    if (player.turn) {

        if (player.path.length > 0 || player.currentNode != null) {
            console.log('player.turn')
            // console.log('len',player.path.length)
            //Step
            keepWalking = player.walk(tilemap);

            if (!keepWalking) {
                console.log('here')
                player.turn = false;
            }

        }

        else {
            //Some other kind of interaction.
        }

    }
    else if (other_turn || keepWalking) {
        //console.log('not player turn')
        if(characterList.list.length > 0){

        
        for (let i = 0; i < characterList.list.length; i++) {
            let char = characterList.list[i];
            if (char.turn) {

                if (char.detectPlayer()) {
                    console.log('here')
                    console.log('Detected player!')
                    mode = "combat";
                }
                else {
                    console.log('else')
                }
                other_turn = true;
                console.log(char.name + ' turn')
                console.log('path len', char.path.length)
                console.log('currentNode', char.currentNode)
                if (char.path.length > 0 || char.currentNode != null) {
                    console.log(char.name + ' walk')
                    keepWalking = char.walk(tilemap);

                    if (!keepWalking) {
                        other_turn = false;
                        console.log('here2')
                        char.turn = false;
                    }
                }
                else {
                    console.log('moveRandomly')
                    other_turn = false;
                    char.turn = false;
                    char.moveRandomly();
                    console.log('after moveRandomly')
                    console.log('keepWalking', keepWalking)
                    console.log('other_turn', other_turn)
                    for (let i = 0; i < characterList.list.length; i++) {
                        console.log(characterList.list[i].name + ' turn:' + characterList.list[i].turn);
                    }
                }
            }
        }
    }
    else{
        other_turn = false;
    }

    }
    else if (!keepWalking) {
        player.turn = true;
        for (let i = 0; i < characterList.list.length; i++) {
            let character = characterList.list[i];
            character.turn = true;
        }
        other_turn = true;
        turns++;
        console.log('turns', turns)
    }

    return { "turns": turns, "other_turn": other_turn, "keepWalking": keepWalking, "mode": mode }
}

function createRect(x, y) {
    let rect = new PIXI.Graphics()
        .lineStyle({ color: 1, width: 1, native: true })
        .drawShape({ "x": x, "y": y, "width": 16, "height": 16, "type": 1 });

    rect.hitArea = rect.getBounds();
    rect.interactive = true;
}

function copyNodes(nodes) {
    let temp = [];

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        temp.push(new Tile(node.row, node.col, node.tile));
    }

    console.log(temp)
}
