// map
class TileMap {
    constructor(game,container) {

        this._game = game;
        this._body = {};
        this.width;
        this.height;
        this.collisionLayer;
        this.container = container;
        this.mapArr;
        this.current_position = {"col":10,"row":15};
        
        var tileset = PIXI.Texture.from("/assets/maps/map.png");
        console.log('tileset', tileset)
        //this._game.on( 'update', this._update.bind( this ) );
        this._createMap(tileset);
        
    }

    async _createMap(tileset) {

        // load json
        //var level = require('../map/map.json');j
        var level = await this.getJsonFile(function (data) {
            return data
        });
        console.log(level)
        var tileHeight = 16;
        var tileWidth = 16;
        var layers = level.layers;
        var height = level.height;
        var width = level.width;

        this.width = width * tileWidth;
        this.height = height * tileHeight;

        let levelHeight = 0;
        console.log(level)

        this.collisionLayer = this.getCollisionLayer(layers);
        console.log(this.collisionLayer)

        this.createMapArray(this.collisionLayer)
        console.log(this.mapArr)
        this.mapArr[10][15].char_here = true;
        
        //setTimeout(() => {   }, 10000);


        for (let col = 0; col < height; col++) {
            for (let row = 0; row < width; row++) {
                //Postition on screen
                //height = 20
                //width = 30
                if (row % (width - 1) == 0) {
                    if (row > 0) {
                        var y = levelHeight;
                        var x = row % width | 0;
                        levelHeight++;
                    }
                    else {
                        var y = levelHeight;
                        var x = row % width | 0;
                    }

                }
                else {
                    var y = levelHeight;
                    var x = row % width | 0;
                }

                //         console.log("data",data[i])


                //I know this looks backwards, but trust :)
                var tileRow = col;
                var tileCol = row;

                // console.log('tileRow', row);
                // console.log('tileCol', col);
                // console.log('')
                //x and y
                var text = new PIXI.Texture(tileset, new PIXI.Rectangle(tileCol * 16, tileRow * 16, tileWidth, tileHeight));
                var layer = new PIXI.Sprite(text);
                layer.x = x * tileHeight;
                layer.y = y * tileWidth;
                layer.zIndex = -99999;
                layer._zIndex = -99999;
                // console.log('layer x',layer.x);
                // console.log('layer y',layer.y);
                // console.log('')
                
                //this._game.stage.addChild(layer);
                this.container.addChild(layer)
                //if(row == 30){throw new Error("Something went badly wrong!");}

            }//row
            //if(col == 1){throw new Error("Something went badly wrong!");}
        }
        // }
    }

    createMapArray(collisionLayer){
        this.mapArr = [];
        let index = 0;

        for(let col =0; col < collisionLayer.height; col++){
            let tempArr = [];
            for(let row =0; row < collisionLayer.width; row++){
                if(collisionLayer.data[index] == 0){
                    tempArr.push({"walkable" : true, "char_here": false})
                }
                else{
                    //this.mapArr[col][row] = 1
                    tempArr.push({"walkable" : false, "char_here": false})
                }
                index++;
            }
            this.mapArr.push(tempArr)
        }

        console.log(this.mapArr)
    }

    find_char_position(){
        for(let col = 0; col < this.collisionLayer.height; col++){
            for(let row = 0; row < this.collisionLayer.width; row++){
                if(this.mapArr[col][row].char_here){
                    console.log({"col":col, "row":row})
                    return {"col":col, "row":row};
                }
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

    updateCharPosition(position){
        console.log(this.current_position)
        this.mapArr[this.current_position.col][this.current_position.row].char_here = false;
        this.mapArr[position.col][position.row].char_here = true;
        this.current_position = {"col" : position.col, "row" : position.row}
    }

    async getJsonFile(callback) {
        // http://localhost:8080
        let file = await fetch('/assets/maps/map.json')
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

        if (position.col > -1 && position.row > -1)

            if (this.mapArr[position.col][position.row].walkable) {
                console.log(true)
                return true;
            }
            else {
                console.log(false)
                return false;
            }


    }
};