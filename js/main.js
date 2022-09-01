// Create the application helper and add its render target to the page
const app = new PIXI.Application({
    width: 480,
    height: 320,
    transparent: false,
    antialis: true,
    resolution: 1
});
const loader = PIXI.Loader.shared;
const MapContainer = new PIXI.Container();
const PlayerContainer = new PIXI.Container();
const Container = new PIXI.Container();
var message;

document.body.appendChild(app.view);
// app.stage.scale.x = 2.2
// app.stage.scale.y = 3.7


//Add containers
app.stage.addChild(MapContainer);
app.stage.addChild(PlayerContainer);
app.stage.addChild(Container)

//Create tilemap
let tilemap = new TileMap(app, MapContainer, '/assets/maps/map.png', '/assets/maps/map.json');

//Create Player
let mainPlayer = new Player("Jake", loader, app, PlayerContainer, tilemap);

app.stage.interactive = true;

app.stage.on("mousedown", function(e){  
  console.log(e.data.global.x)
  click2Move(e.data.global.x,e.data.global.y);
})


// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    //container.rotation -= 0.01 * delta;

});

function click2Move(x,y){
    let row = Math.floor(x/16);
    let col = Math.floor(y/16);

    let playerPosition = mainPlayer.sprite;

    if(x > playerPosition.x){
        mainPlayer.sprite.position.set(Math.floor((playerPosition.x + Math.abs(x-playerPosition.x))/16)*16 ,Math.floor((playerPosition.y + Math.abs(x-playerPosition.x))/16)*16);
    }
    else{
        mainPlayer.sprite.position.set(Math.floor((playerPosition.x - Math.abs(x-playerPosition.x))/16)*16 , Math.floor((playerPosition.y - Math.abs(y-playerPosition.y))/16)*16);
    }
    console.log("row",row);
    console.log('player',Math.floor(playerPosition.x/16))
    console.log("diff",Math.abs(row-(Math.floor(playerPosition.x/16))))
    console.log('end',Math.floor((playerPosition.x + Math.abs(x-playerPosition.x))/16)*16)

    // mainPlayer.sprite.position.set(Math.abs(row-(Math.floor(playerPosition._x/16)))*16 , Math.abs(col-(Math.floor(playerPosition._y/16)))*16);
    mainPlayer.sprite.position.set(Math.floor((playerPosition.x + Math.abs(x-playerPosition.x))/16)*16 , playerPosition.y);
}

function move(e, player, tilemap) {
    //Move Left
    console.log('message',message)
    if(message != null){
        message.destroy()
    }
    if (e.keyCode == 65) {
        //console.log("moveLeft")
        player.changeAnimation(player.walkLeftAnimation);
        let temp = tilemap.check_if_walkable({ "col": tilemap.current_position.col, "row": tilemap.current_position.row - 1 });
        if (temp.walk) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col, "row": tilemap.current_position.row - 1 })
            tilemap.displayMapArray('grid')
            player.sprite.position.set(player.x -= 16, player.y)
            //event.start(temp.action)
            console.log('temp',temp)
            if(temp.action){
                console.log('creating event')
                message = new Event(temp.action);
                
            }

        }

    }
    //Move Right
    else if (e.keyCode == 68) {
        //console.log("move right")
        player.changeAnimation(player.walkRightAnimation);
        let temp = tilemap.check_if_walkable({ "col": tilemap.current_position.col, "row": tilemap.current_position.row + 1 });
        if (temp.walk) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col, "row": tilemap.current_position.row + 1 })
            tilemap.displayMapArray('grid')
            player.sprite.position.set(player.x += 16, player.y)

            if(temp.action){
                //console.log('here')
                message = new Event(temp.action);
                //console.log(message)
            }

        }

    }
    // // //Move Down
    else if (e.keyCode == 83) {
        player.changeAnimation(player.walkDownAnimation);
        let temp = tilemap.check_if_walkable({ "col": tilemap.current_position.col + 1, "row": tilemap.current_position.row });
        if (temp.walk) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col + 1, "row": tilemap.current_position.row })
            tilemap.displayMapArray('grid')
            player.sprite.position.set(player.x, player.y += 16)

            if(temp.action){
                console.log('creating event')
                message = new Event(temp.action);
                
            }

        }

    }
    else if (e.keyCode == 87) {
        player.changeAnimation(player.walkUpAnimation);
        let temp = tilemap.check_if_walkable({ "col": tilemap.current_position.col - 1, "row": tilemap.current_position.row });
        if (temp.walk) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col - 1, "row": tilemap.current_position.row })
            tilemap.displayMapArray('grid')
            player.sprite.position.set(player.x, player.y -= 16)

            if(temp.action){
                console.log('creating event')
                message = new Event(temp.action);
                
            }

        }

    }

    // testSprite._game.stage.x -= 100
    // testSprite._game.stage.y -= 100
}


//Hoping to get rid of this
$('body').on('keydown', (function () {
    //event is being passed from the event listener.
    move(event, mainPlayer, tilemap)
}).bind(mainPlayer, tilemap));




