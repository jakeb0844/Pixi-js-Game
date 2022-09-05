// map
class TileMap {
    constructor(game, container, mapImage, mapJson, playerPosition, tileDimensions = { "height": 16, "width": 16 }) {

        this.game = game;
        this.width;
        this.height;
        this.collisionLayer;
        this.actionLayer;
        this.container = container;
        this.gridObj;
        this.playerPosition = playerPosition;
        this.mapJson = mapJson;
        this.rects = [];
        this.tileHeight = tileDimensions.height;
        this.tileWidth = tileDimensions.width;

        //this.player = player;
        this.rectsToClear = [];
        //this.tileset = PIXI.Texture.from(mapImage);

        var tileset = PIXI.Texture.from(mapImage);
        this._createMap(tileset,this.playerPosition);

    }

    async _createMap(tileset,playerPosition) {

        // load json
        var level = await this.getJsonFile(function (data) {
            return data
        });

        var layers = level.layers;
        var height = level.height;
        var width = level.width;

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
                Container.addChild(rect)

                this.container.addChild(layer)

            }

        }

        this.gridObj = this.createGrid(this.collisionLayer);

        let row = Math.floor(playerPosition.x / 16);
        let col = Math.floor(playerPosition. y / 16);
        this.playerPosition = {"row": row, "col": col};
        this.gridObj.grid[col][row].playerPosition = true;
        this.gridObj.printGrid('grid')
        
    }

    find_path(start, end) {
        if (!end.wall) {

            let di = new Dijkstra(this.gridObj.grid, start, end);
            let { visited, endNode } = di.find_path(di.grid, di.startNode, di.endNode);
            
            let shortest_path = di.makePath(endNode);
            
            this.path = shortest_path;

            for (const node of shortest_path) {
                let tile = node.tile;
                tile.clear()
                .lineStyle({ color: 0xaaaa, width: 1, native: true })
                .drawShape({ "x": node.col * 16, "y": node.row * 16, "width": 16, "height": 16, "type": 1 });
                this.rectsToClear.push(tile);
            }

        }

    }

    createRect(x, y) {
        let rect = new PIXI.Graphics()
            .lineStyle({ color: 1, width: 1, native: true })
            .drawShape({ "x": x, "y": y, "width": 16, "height": 16, "type": 1 });

        rect.hitArea = rect.getBounds();
        rect.interactive = true;

        rect.on('click', (function (e) {
            let endRow = Math.floor(e.data.global.x / 16);
            let endCol = Math.floor(e.data.global.y / 16);
            let grid = this.gridObj.grid;
            let playerX = Math.floor(this.player.sprite.x / 16) * 16;
            let playerY = Math.floor(this.player.sprite.y / 16) * 16;

            // If the player is following the path, stop walking, set the player to the nearest tile,
            // and remove the already walked portion;
            if (this.player.walking) {
                this.player.stopWalking()
                this.player.sprite.x = playerX;
                this.player.sprite.y = playerY;
                this.player.x = playerX;
                this.player.y = playerY;

                this.path = this.path.slice(index)
                

            }
            else {

                if (!grid[endCol][endRow].wall) {
                    this.player.startWalking()
                }
            }

        }).bind(this))

        rect.on('mouseover', (function (e) {
            let endRow = Math.floor(e.data.global.x / 16);
            let endCol = Math.floor(e.data.global.y / 16);
            let grid = this.gridObj.grid;
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

        let grid = new Grid(this.collisionLayer.width, this.collisionLayer.height, this.collisionLayer, this.rects);
        return grid;

    }

    find_char_position() {
        for (let col = 0; col < this.collisionLayer.height; col++) {
            for (let row = 0; row < this.collisionLayer.width; row++) {
                if (this.gridObj.grid[col][row].playerPosition) {
                   
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
        let grid = this.gridObj.grid;
        grid[this.playerPosition.col][this.playerPosition.row].playerPosition = false;
        grid[position.col][position.row].playerPosition = true;
        this.playerPosition = { "col": position.col, "row": position.row }
    }

    async getJsonFile(callback) {
        let file = await fetch(this.mapJson)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                return json;
            })
            .catch(function () {
                console.log('error')
            })

        return file;
    }
};