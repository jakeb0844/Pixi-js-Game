// map
class TileMap {
    constructor(game, container, mapImage, mapJson) {

        this._game = game;
        this._body = {};
        this.width;
        this.height;
        this.collisionLayer;
        this.container = container;
        this.mapArr;
        this.current_position = { "col": 10, "row": 15 };
        this.mapJson = mapJson;
        this.i = 0;
        this.tile = [];

        var tileset = PIXI.Texture.from(mapImage);
        //console.log('tileset', tileset)
        //this._game.on( 'update', this._update.bind( this ) );
        this._createMap(tileset);

    }

    async _createMap(tileset) {

        // load json
        //var level = require('../map/map.json');j
        var level = await this.getJsonFile(function (data) {
            return data
        });
        //console.log(level)
        var tileHeight = 16;
        var tileWidth = 16;
        var layers = level.layers;
        var height = level.height;
        var width = level.width;

        this.width = width * tileWidth;
        this.height = height * tileHeight;

        let levelHeight = 0;
        //console.log(level)

        this.collisionLayer = this.getCollisionLayer(layers);
        this.actionLayer = this.getActionLayer(layers);

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                //Postition on screen
                //height = 20
                //width = 30
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

                // console.log('tileRow', row);
                // console.log('tileCol', col);

                var text = new PIXI.Texture(tileset, new PIXI.Rectangle(tileCol * 16, tileRow * 16, tileWidth, tileHeight));
                var layer = new PIXI.Sprite(text);
                layer.x = x * tileWidth;
                layer.y = y * tileHeight;
                let rect = this.createRect(layer.x, layer.y);
                this.tile[this.i] = rect;
                this.i++;
                Container.addChild(rect)

                this.container.addChild(layer)
                //if(row == 30){throw new Error("Something went badly wrong!");}

            }//col
            //if(col == 1){throw new Error("Something went badly wrong!");}
        }
        //this.createMapArray(this.collisionLayer,this.actionLayer)
        this.grid = this.createGrid(this.collisionLayer);

        this.grid.grid[10][15].char_here = true;
        this.displayMapArray('grid')
        // }
    }

    find_path(start, end) {
        if (!end.wall) {
            let di = new Dijkstra(tilemap.grid, start, end)
            let { visited, endNode } = di.find_path(di.grid, di.startNode, di.endNode)
            //console.log('start',di.startNode)
            //console.log('end',end)
            let shortest_path = di.makePath(endNode);
            //console.log(di.endNode)
            this.path = shortest_path;

            for (const node of shortest_path) {
                let tile = node.tile;
                tile.clear()
                    //.beginFill(0xFC0202)
                    .lineStyle({ color: 0xaaaa, width: 1, native: true })
                    .drawShape({ "x": node.col * 16, "y": node.row * 16, "width": 16, "height": 16, "type": 1 });

                // mainPlayer.sprite.x = node.col *16;
                // mainPlayer.sprite.y = node.row * 16;
                // mainPlayer.x = node.col * 16;
                // mainPlayer.y = node.row * 16;

                // node.parent = null;
                // node.distance = Infinity;
                // node.visited = false;
            }

            // for(let i =0; i < path.length; i++){
            //     //path[i].parent = null;
            //     //path[i].distance = Infinity;
            //     //path[i].visited = false;
            // }





            // for(let i=0; i < tilemap.grid.nodes.length; i++){
            //     tilemap.grid.nodes[i].parent = null;
            //     tilemap.grid.nodes[i].visted = false;
            //     tilemap.grid.nodes[i].distance = Infinity;
            // }
        }
        // console.log(path)
        // console.log(di.makePath(di.endNode))
    }

    createRect(x, y) {
        let rect = new PIXI.Graphics()
            //.beginFill(0x00F000)
            .lineStyle({ color: 0xffffff, width: 1, native: true })
            .drawShape({ "x": x, "y": y, "width": 16, "height": 16, "type": 1 });
        //.endFill();

        //rect.position.set(x, y)
        rect.hitArea = rect.getBounds();
        rect.interactive = true;
        //rect.buttonMode = true;

        rect.on('click', (function (e) {
            let row = Math.floor(e.data.global.x / 16);
            let col = Math.floor(e.data.global.y / 16);
            if (mainPlayer.walking) {
                mainPlayer.walking = false;
                mainPlayer.sprite.x = Math.floor(mainPlayer.sprite.x / 16) * 16 
                mainPlayer.sprite.y = Math.floor(mainPlayer.sprite.y / 16) * 16 
                mainPlayer.x = Math.floor(mainPlayer.sprite.x / 16) * 16;
                mainPlayer.y = Math.floor(mainPlayer.sprite.y / 16) * 16;
                // for(let i =0; i < index; i++){
                //     this.path[i].tile.clear()
                // }
                this.path = this.path.slice(index)


            }
            else {

                if (!this.grid.grid[col][row].wall) {
                    mainPlayer.walk()
                }
            }


            //this.path = 
        }).bind(this))

        rect.on('mouseover', (function (e) {
            //console.log(Math.floor(this.hitArea.x/16) + " and " + Math.floor(this.hitArea.y/16))
            let row = Math.floor(e.data.global.x / 16);
            let col = Math.floor(e.data.global.y / 16);
            //console.log(row + ' and ' + col)
            let playerX = mainPlayer.x;
            let playerY = mainPlayer.y;
            console.log(Math.floor(playerX / 16) + " and " + Math.floor(playerY / 16))
            //console.log(this.grid.grid[Math.floor(playerX/16)][Math.floor(playerY/16)])


            let r = this.grid.grid[col][row].tile;
            //console.log(r)
            r.clear();
            //r.beginFill(0xFC0202);
            r.lineStyle({ color: 0xfc0202, width: 1, native: true })
            r.drawShape({ "x": row * 16, "y": col * 16, "width": 16, "height": 16, "type": 1 })

            if (!mainPlayer.walking) {
                this.find_path(this.grid.grid[Math.floor(mainPlayer.sprite.y / 16)][Math.floor(mainPlayer.sprite.x / 16)], this.grid.grid[col][row])
            }


        }).bind(this))


        rect.on('mouseout', (function (e) {
            for (let i = 0; i < tilemap.tile.length; i++) {
                tilemap.tile[i].clear();
            }
        }))

        //console.log(rect)
        //rect.clear();
        return rect;
    }

    displayMapArray(id) {
        let mapArr = this.grid.grid;
        let nodes = this.grid.nodes;
        let height = mapArr.length;
        let width = mapArr[0].length;
        let html = '';
        let index = 0;

        let el = $('#' + id);
        el.html('');

        el.append('<table>')

        for (let col = 0; col < height; col++) {
            //el.append('<tr>')
            html = '';
            html += "<tr>";
            for (let row = 0; row < width; row++) {
                //el.append('<td>')
                html += "<td onClick='toggle(this)'>";
                html += col + "," + row;

                // if(nodes[index].char_here){
                //     //el.append('X')
                //     html += "<td style='background:yellow'>";
                //     html += "X";
                // }
                // // else if(mapArr[col][row].action){
                // //     html += "<td style='background:green'>";
                // //     html += "a";
                // // }
                // else if(!nodes[index].wall){
                //     //el.append('0')
                //     html += "<td style='background:lightblue'>";
                //     html += "0";
                // }
                // else{
                //     //el.append('1')
                //     html += "<td style='background:red'>";
                //     html += "1";
                // }
                //el.append('</td>')
                html += "</td>";
                index++
            }

            //el.append('</tr>')
            html += "</tr>";
            el.append(html);

        }
        el.append('</table>')
    }

    createGrid(collisionLayer) {

        let grid = new Grid(collisionLayer.width, collisionLayer.height, collisionLayer, this.tile);
        return grid;
        //console.log(actionLayer)
        // this.mapArr = [];
        // let index = 0;

        // for (let col = 0; col < collisionLayer.height; col++) {
        //     let tempArr = [];
        //     for (let row = 0; row < collisionLayer.width; row++) {
        //         if (collisionLayer.data[index] == 0) {
        //             tempArr.push({ "walkable": true, "char_here": false,"tile": this.tile[index] })
        //         }
        //         else {
        //             //this.mapArr[col][row] = 1
        //             tempArr.push({ "walkable": false, "char_here": false,"tile": this.tile[index] })
        //         }

        //         for(let i=0; i < actionLayer.layers.length; i++){
        //             if(actionLayer.layers[i].data[index] > 0){
        //                 tempArr.pop();
        //                 tempArr.push({"walkable": true, "char_here": false,"action":actionLayer.layers[i].properties[0].value,"tile": this.tile[index]})
        //             }
        //         }


        //         index++;
        //     }
        //     this.mapArr.push(tempArr)
        // }

        //console.log(this.mapArr)
    }

    find_char_position() {
        for (let col = 0; col < this.collisionLayer.height; col++) {
            for (let row = 0; row < this.collisionLayer.width; row++) {
                if (this.mapArr[col][row].char_here) {
                    //console.log({ "col": col, "row": row })
                    return { "col": col, "row": row };
                }
            }
        }

        return null;
    }

    getActionLayer(mapData) {
        console.log(mapData)
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
        //console.log(this.current_position)
        this.mapArr[this.current_position.col][this.current_position.row].char_here = false;
        this.mapArr[position.col][position.row].char_here = true;
        this.current_position = { "col": position.col, "row": position.row }
    }

    async getJsonFile(callback) {
        // http://localhost:8080
        let file = await fetch(this.mapJson)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                //console.log(json)
                return json;
                //callback(json);
                //console.log(this.users);
            })
            .catch(function () {
                console.log('error')
            })

        return file;
    }


    check_if_walkable(position) {
        console.log(position)


        if (position.col > -1 && position.row > -1) {

            let obj = this.mapArr[position.col][position.row];
            console.log(obj)

            if (obj.walkable) {
                if (obj.action) {
                    return { "walk": true, "action": obj.action };
                }
                //console.log(true)
                return { "walk": true };
            }
            else {
                //console.log(false)
                return { "walk": false };
            }

        }

        return { "walk": false }


    }
};