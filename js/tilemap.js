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
        //console.log(this.collisionLayer)

        // this.createMapArray(this.collisionLayer,this.actionLayer)
        //console.log(this.mapArr)
        // this.mapArr[10][15].char_here = true;

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
                let rect = this.createRect(layer.x,layer.y);
                this.tile[this.i] = rect;
                this.i++;
                Container.addChild(rect)
                // layer.zIndex = -99999;
                // layer._zIndex = -99999;
                // console.log('layer x',layer.x);
                // console.log('layer y',layer.y);
                // console.log('')

                //this._game.stage.addChild(layer);
                this.container.addChild(layer)
                //if(row == 30){throw new Error("Something went badly wrong!");}
                
            }//row
            //if(col == 1){throw new Error("Something went badly wrong!");}
        }
        this.createMapArray(this.collisionLayer,this.actionLayer)
        this.mapArr[10][15].char_here = true;
        this.displayMapArray('grid')
        // }
    }

    createRect(x,y){
        let rect = new PIXI.Graphics()
            // .beginFill(0x00F000)
            .lineStyle({ color: 1, width:1, native: true })
            .drawShape({ "x": x, "y": y, "width": 16, "height": 16, "type": 1 })
            //.endFill();

        //rect.position.set(x, y)
        rect.hitArea = rect.getBounds();
        rect.interactive = true;
        //rect.buttonMode = true;

        // rect.on('click',(function(e){
        //     let x = Math.floor(e.data.global.x/16);
        //     let y = Math.floor(e.data.global.y/16);
        //     console.log(x + ' and ' + y)
        //     let playerX = mainPlayer.x;
        //     let playerY = mainPlayer.y;
        //     console.log(playerX + " and " + playerY)
            
        //     let r = this.mapArr[y][x].tile;
        //     r.clear();
        //     r.beginFill(0xFC0202);
        //     r.lineStyle({ color: 0xffff, width:1, native: true })
        //     r.drawShape({ "x": x * 16, "y": y * 16, "width": 16, "height": 16, "type": 1 })

        //     let temp = [];

        //     for(let i =0; i < (x - playerX/16);i++){
        //         temp.push(this.mapArr[i+1][0])
        //     }

        //     console.log(temp)

        //     for(let i=0; i < temp.length; i++){
        //         temp[i].tile.clear();
        //         temp[i].tile.beginFill(0xFC0202);
        //         temp[i].tile.lineStyle({ color: 0xffff, width:1, native: true })
        //         temp[i].tile.drawShape({ "x": (Math.floor(playerX/16) + (i+1)) * 16, "y": y*16, "width": 16, "height": 16, "type": 1 })
        //     }
            

        // }).bind(this))

        rect.on('mouseover',(function(e){
            let x = Math.floor(e.data.global.x/16);
            let y = Math.floor(e.data.global.y/16);
            //console.log(x + ' and ' + y)
            let playerX = mainPlayer.x;
            let playerY = mainPlayer.y;
           // console.log(playerX + " and " + playerY)
            
            let r = this.mapArr[y][x].tile;
            r.clear();
            //r.beginFill(0xFC0202);
            r.lineStyle({ color: 0xFC0202, width:1, native: true })
            r.drawShape({ "x": x * 16, "y": y * 16, "width": 16, "height": 16, "type": 1 })

            let tempX = [];
            let tempY = [];

            if(playerX/16 > x){
                for(let i =0; i < (playerX/16 - x);i++){
                    tempX.push(this.mapArr[0][i])
                }
    
                //console.log(tempX)
    
                for(let i=0; i < tempX.length; i++){
                    //temp[i].tile.clear();
                    //temp[i].tile.beginFill(0xFC0202);
                    tempX[i].tile.lineStyle({ color: 0xFC0202, width:1, native: true })
                    tempX[i].tile.drawShape({ "x": (Math.floor(playerX/16) - (i+1)) * 16, "y": y*16, "width": 16, "height": 16, "type": 1 })
                }
            }
            else{
                for(let i =0; i < (x - playerX/16);i++){
                    tempX.push(this.mapArr[0][i])
                }
    
                //console.log(tempX)
    
                for(let i=0; i < tempX.length; i++){
                    //temp[i].tile.clear();
                    //temp[i].tile.beginFill(0xFC0202);
                    tempX[i].tile.lineStyle({ color: 0xFC0202, width:1, native: true })
                    tempX[i].tile.drawShape({ "x": (Math.floor(playerX/16) + (i+1)) * 16, "y": y*16, "width": 16, "height": 16, "type": 1 })
                }
            }

            if(playerY/16 > y){
                for(let i =0; i < (playerY/16 - y);i++){
                    tempY.push(this.mapArr[i+1][0])
                }
    
                //console.log(tempY)
    
                for(let i=0; i < tempY.length; i++){
                    //temp[i].tile.clear();
                    //temp[i].tile.beginFill(0xFC0202);
                    tempY[i].tile.lineStyle({ color: 0xFC0202, width:1, native: true })
                    tempY[i].tile.drawShape({ "x": playerX, "y": (Math.floor(playerY/16) - (i+1)) * 16, "width": 16, "height": 16, "type": 1 })
                }
            }
            else{
                for(let i =0; i < (y - playerY/16);i++){
                    tempY.push(this.mapArr[i+1][0])
                }
    
                //console.log(tempY)
    
                for(let i=0; i < tempY.length; i++){
                    //temp[i].tile.clear();
                    //temp[i].tile.beginFill(0xFC0202);
                    tempY[i].tile.lineStyle({ color: 0xFC0202, width:1, native: true })
                    tempY[i].tile.drawShape({ "x": playerX, "y": (Math.floor(playerY/16) + (i+1)) * 16, "width": 16, "height": 16, "type": 1 })
                }
            }

            

            
            

            

           // this.tile = temp;
            
        }).bind(this))

        rect.on('mouseout',(function(e){
            for(let i=0; i < tilemap.tile.length; i++){
                tilemap.tile[i].clear();
            }
        }))
        
        //console.log(rect)
        rect.clear();
        return rect;
    }

    displayMapArray(id){
        let height = this.mapArr.length;
        let width = this.mapArr[0].length;
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
                
                if(this.mapArr[col][row].char_here){
                    //el.append('X')
                    html += "<td style='background:yellow'>";
                    html += "X";
                }
                else if(this.mapArr[col][row].action){
                    html += "<td style='background:green'>";
                    html += "a";
                }
                else if(this.mapArr[col][row].walkable){
                    //el.append('0')
                    html += "<td style='background:lightblue'>";
                    html += "0";
                }
                else{
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

    createMapArray(collisionLayer,actionLayer) { 
        //console.log(actionLayer)
        this.mapArr = [];
        let index = 0;

        for (let col = 0; col < collisionLayer.height; col++) {
            let tempArr = [];
            for (let row = 0; row < collisionLayer.width; row++) {
                if (collisionLayer.data[index] == 0) {
                    tempArr.push({ "walkable": true, "char_here": false,"tile": this.tile[index] })
                }
                else {
                    //this.mapArr[col][row] = 1
                    tempArr.push({ "walkable": false, "char_here": false,"tile": this.tile[index] })
                }

                for(let i=0; i < actionLayer.layers.length; i++){
                    if(actionLayer.layers[i].data[index] > 0){
                        tempArr.pop();
                        tempArr.push({"walkable": true, "char_here": false,"action":actionLayer.layers[i].properties[0].value,"tile": this.tile[index]})
                    }
                }

                
                index++;
            }
            this.mapArr.push(tempArr)
        }

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

    getActionLayer(mapData){
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
        
        
        if (position.col > -1 && position.row > -1){

            let obj = this.mapArr[position.col][position.row];
            console.log(obj)

            if (obj.walkable) {
                if(obj.action){
                    return {"walk":true,"action":obj.action};
                }
                //console.log(true)
                return {"walk":true};
            }
            else {
                //console.log(false)
                return {"walk":false};
            }

        }

        return {"walk":false}


    }
};