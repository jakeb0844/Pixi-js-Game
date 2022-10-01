// map
//import {Grid} from './grid.js';
import { Pathfinding } from "./pathfinding.js";

export class Tilemap {
    constructor(app, loader, container, TileContainer, playerPosition, player, tileDimensions = { "height": 16, "width": 16 }) {

        this.app = app;
        this.loader = loader;
        this.width;
        this.height;
        this.collisionLayer;
        this.actionLayer;
        this.container = container;
        this.tileContainer = TileContainer;
        this.player = player;
        this.playerPosition = playerPosition;
        this.enemeyPosition;
        //this.mapJson = mapJson;
        this.rects = [];
        this.tileHeight = tileDimensions.height;
        this.tileWidth = tileDimensions.width;

        //this.player = player;
        this.rectsToClear = [];

        var tileset = this.loader.getAsset('map').resource.texture;

        this._createMap(tileset, this.playerPosition);

    }

    addChild(entity) {
        let row = Math.floor(entity.x / 16);
        let col = Math.floor(entity.y / 16);

        console.log(row + " " + col)

        this.grid[col][row].enemeyPosition = true;
    }

    async _createMap(tileset, playerPosition) {

        // load json
        // var level = await this.getJsonFile(function (data) {
        //     return data
        // });

        let level = this.loader.getAsset('mapJson').resource;


        var layers = level.data.layers;
        var height = level.data.height;
        var width = level.data.width;

        var tileHeight = this.tileHeight;
        var tileWidth = this.tileWidth;

        this.width = width * tileWidth;
        this.height = height * tileHeight;

        let levelHeight = 0;
        let tileIndex = 0;


        this.collisionLayer = this.getCollisionLayer(layers);
        this.actionLayer = this.getActionLayer(layers);

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {

                if (col % (width - 1) == 0) {
                    if (col > 0) {
                        var y = levelHeight;
                        var x = col % width | 0;
                        levelHeight++;
                    }
                    else {
                        var y = levelHeight;
                        var x = col % width | 0;
                    }

                }
                else {
                    var y = levelHeight;
                    var x = col % width | 0;
                }

                var tileRow = row;
                var tileCol = col;


                var texture = new PIXI.Texture(tileset, new PIXI.Rectangle(tileCol * this.tileHeight, tileRow * this.tileWidth, tileWidth, tileHeight));
                var layer = new PIXI.Sprite(texture);
                layer.x = x * tileWidth;
                layer.y = y * tileHeight;
                let rect = this.createRect(layer.x, layer.y);
                this.rects[tileIndex] = rect;
                tileIndex++;
                this.tileContainer.addChild(rect)

                this.container.addChild(layer)

            }

        }

        let { grid, nodes } = this.createGrid(this.collisionLayer);

        this.grid = grid;
        this.nodes = nodes;

        let row = Math.floor(playerPosition.x / 16);
        let col = Math.floor(playerPosition.y / 16);
        this.playerPosition = { "row": row, "col": col };
        this.grid[col][row].playerPosition = true;
        console.log(this.grid[col][row])
        setTimeout(function () {
            printGrid(grid, 'grid')
        }, 1000);


    }

    find_path(start, end) {

        if ((!end.wall)) {

            let di = new Pathfinding(this.grid, start, end);
            let { visited, endNode } = di.find_path(di.grid, di.startNode, di.endNode);

            let shortest_path = di.makePath(endNode);
            //console.log(shortest_path);
            // shortest_path.shift();
            // console.log(shortest_path);
            // this.path = shortest_path;
            // this.player.path = shortest_path;
            this.test = shortest_path;

            for (const node of shortest_path) {
                let tile = node.tile;
                tile.clear()
                    .lineStyle({ color: 0xaaaa, width: 1, native: true })
                    .drawShape({ "x": node.col * 16, "y": node.row * 16, "width": 16, "height": 16, "type": 1 });
                this.rectsToClear.push(tile);
            }

        }
        else {
            // this.path = [];
            this.player.path = [];
        }


    }

    createRect(x, y) {
        let rect = new PIXI.Graphics()
            .lineStyle({ color: 1, width: 1, native: true })
            .drawShape({ "x": x, "y": y, "width": 16, "height": 16, "type": 1 });

        rect.hitArea = rect.getBounds();
        rect.interactive = true;

        rect.on('click', (function (e) {
            //console.log(this.player)
            let endRow = Math.floor(e.data.global.x / 16);
            let endCol = Math.floor(e.data.global.y / 16);
            let grid = this.grid;
            let playerX = Math.floor(this.player.sprite.x / 16) * 16;
            let playerY = Math.floor(this.player.sprite.y / 16) * 16;

            if (this.app.game.mode == 'exploration') {
                // If the player is following the path, stop walking, set the player to the nearest tile,
                // and remove the already walked portion;
                if (this.player.walking) {
                    this.player.stopWalking()
                    this.player.changeAnimation(this.player.animations.default)
                    this.player.sprite.x = playerX;
                    this.player.sprite.y = playerY;
                    this.player.x = playerX;
                    this.player.y = playerY;

                    // this.path = this.path.slice(index)
                    //this.player.path = this.player.path.slice(index)
                    this.player.path = [];
                    //this.test = [];


                }
                else {

                    if (!grid[endCol][endRow].wall) {
                        this.player.path = this.test;
                        this.player.path[0].tile.clear();
                        this.player.path.shift();
                        this.player.startWalking()
                    }
                }
            }
            else{
                console.log(this.app.game)
                if(this.app.game.combatChoice == 'attack'){
                    this.player.attackNode = this.getTile(rect.getBounds());
                }
                else{
                    this.player.combatPath = [this.getTile(rect.getBounds())];
                }
                
            }



        }).bind(this))

        rect.on('mouseover', (function (e) {
            let endRow = Math.floor(e.data.global.x / 16);
            let endCol = Math.floor(e.data.global.y / 16);
            let grid = this.grid;
            let playerRow = Math.floor(this.player.x / 16);
            let playerCol = Math.floor(this.player.y / 16);

            let r = grid[endCol][endRow].tile;
            r.clear();
            r.lineStyle({ color: 0xfc0202, width: 1, native: true })
            r.drawShape({ "x": endRow * this.tileHeight, "y": endCol * this.tileWidth, "width": this.tileWidth, "height": this.tileHeight, "type": 1 })

            this.rectsToClear.push(r);

            if (!this.player.walking) {
                this.find_path(grid[playerCol][playerRow], grid[endCol][endRow])
            }

        }).bind(this))


        rect.on('mouseout', (function (e) {
            for (let i = 0; i < this.rectsToClear.length; i++) {
                this.rectsToClear[i].clear();
            }

            this.rectsToClear = [];

        }).bind(this))

        rect.clear()
        return rect;
    }

    createGrid() {

        return createGrid(this.collisionLayer, this.rects);

    }

    find_char_position() {
        for (let col = 0; col < this.collisionLayer.height; col++) {
            for (let row = 0; row < this.collisionLayer.width; row++) {
                if (this.grid[col][row].playerPosition) {

                    return { "col": col, "row": row };
                }
            }
        }

        return null;
    }

    getActionLayer(mapData) {
        //console.log(mapData)
        for (let i = 0; i < mapData.length; i++) {

            if (mapData[i].name == "Action") {
                return mapData[i];
            }

        }

        return null;
    }

    getCollisionLayer(mapData) {

        for (let i = 0; i < mapData.length; i++) {

            if (mapData[i].name == "Collision") {
                return mapData[i];
            }

        }

        return null;
    }

    updateCharPosition(position) {
        let grid = this.grid;
        grid[this.playerPosition.col][this.playerPosition.row].playerPosition = false;
        grid[position.col][position.row].playerPosition = true;
        this.playerPosition = { "col": position.col, "row": position.row }
    }

    updateEnemyPosition(enemy,position) {
        let grid = this.grid;
        if(this.enemyPosition == undefined){
            this.enemyPosition = { "col": position.col, "row": position.row };
            grid[this.enemyPosition.col][this.enemyPosition.row].enemyPosition = true;
            grid[this.enemyPosition.col][this.enemyPosition.row].enemy = enemy;
        }
        else{
            grid[this.enemyPosition.col][this.enemyPosition.row].enemyPosition = false;
            grid[this.enemyPosition.col][this.enemyPosition.row].enemy = null;
            grid[position.col][position.row].enemyPosition = true;
            grid[position.col][position.row].enemy = enemy;
            this.enemyPosition = { "col": position.col, "row": position.row }
        }
        
    }

    removeEnemy(position){
        let grid = this.grid;

        grid[position.col][position.row].enemyPosition = false;
        grid[position.col][position.row].enemy = null;
    }

    getTile(position) {
        //console.log(position);
        let { row, col } = CalculateRowAndCol(position)
        if (col == this.grid.length) {
            col--;
        }

        if (row == this.grid[0].length) {
            row--;
        }
        //console.log('row: ' + row + ' col: ' + col);
        return this.grid[col][row];

    }
};