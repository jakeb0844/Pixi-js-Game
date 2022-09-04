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
var pos = null;

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

//app.stage.interactive = true;

app.stage.on("mousedown", function (e) {
    console.log("mouse x", e.data.global.x)
    console.log("mouse y", Math.floor(e.data.global.y / 16) * 16)
    //click2Move(e.data.global.x,e.data.global.y);
    pos = { "x": e.data.global.x, "y": e.data.global.y }
})

let a = null;
let walkX = null;
let walkY = null;
let walking = false;
// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    //container.rotation -= 0.01 * delta;
    //console.log(delta)

    if (pos != null) {
        //console.log("player x", mainPlayer.sprite.x)
        //console.log("player y", mainPlayer.sprite.y)
        console.log('walkX', walkX)
        console.log('walkY', walkY)
        if ((walkX == null && walkY == null)) {
            console.log('here')
            let temp = test(pos.x, pos.y)
            walkX = temp.x;
            walkY = temp.y;

        }
        if (walkY != null) {
            if (mainPlayer.sprite.y != walkY) {
                walking = true;

                if (walkY > mainPlayer.sprite.y) {
                    mainPlayer.changeAnimation(mainPlayer.walkDownAnimation);
                    mainPlayer.sprite.y += .5;
                    mainPlayer.y += .5
                }
                else {
                    mainPlayer.changeAnimation(mainPlayer.walkUpAnimation);
                    mainPlayer.sprite.y -= .5
                    mainPlayer.y -= .5
                }
            }

            else {
                //pos = null;
                walkY = null;
                walking = false;
            }
        }
       else if (walkX != null) {

            if (mainPlayer.sprite.x != walkX) {
                walking = true;
                if (walkX > mainPlayer.sprite.x) {
                    mainPlayer.changeAnimation(mainPlayer.walkRightAnimation);
                    mainPlayer.sprite.x += .5;
                    mainPlayer.x += .5;
                }
                else {
                    mainPlayer.changeAnimation(mainPlayer.walkLeftAnimation);
                    mainPlayer.sprite.x -= .5;
                    mainPlayer.x -= .5
                }

            }
            else {
                //pos = null;
                walkX = null;
                walking = false;
            }
        }

       
    
}

    //click2Move(pos.x, pos.y)

    //pos = null;



});

function test(x, y) {
    //console.log('walk x,y',{'x':x,'y':y})
    // x = Math.floor(x/16)*16;
    // y = Math.floor(y/16)*16;
    let temp = 0;
    let temp2 = 0;

    let playerPosition = mainPlayer.sprite;

    if (x > playerPosition.x) {
        temp = Math.floor((playerPosition.x + Math.abs(x - playerPosition.x)) / 16) * 16, playerPosition.y;
    }
    else {
        temp = Math.floor((playerPosition.x - Math.abs(x - playerPosition.x)) / 16) * 16, playerPosition.y;
    }

    if (y > playerPosition.y) {
        temp2 = Math.floor((playerPosition.y + Math.abs(y - playerPosition.y)) / 16) * 16;
    }
    else {
        temp2 = Math.floor((playerPosition.y - Math.abs(y - playerPosition.y)) / 16) * 16;
    }

    console.log({ "x": temp, "y": temp2 })
    return { "x": temp, "y": temp2 }
}

function click2Move(x, y) {

    let playerPosition = mainPlayer.sprite;

    if (x > playerPosition.x) {
        mainPlayer.sprite.position.set(Math.floor((playerPosition.x + Math.abs(x - playerPosition.x)) / 16) * 16, playerPosition.y);
    }
    else {
        mainPlayer.sprite.position.set(Math.floor((playerPosition.x - Math.abs(x - playerPosition.x)) / 16) * 16, playerPosition.y);
    }

    if (y > playerPosition.y) {
        mainPlayer.sprite.position.set(mainPlayer.sprite.x, Math.floor((playerPosition.y + Math.abs(y - playerPosition.y)) / 16) * 16);
    }
    else {
        mainPlayer.sprite.position.set(mainPlayer.sprite.x, Math.floor((playerPosition.y - Math.abs(y - playerPosition.y)) / 16) * 16);
    }

    tilemap.updateCharPosition({ "col": Math.floor(mainPlayer.sprite.y / 16), "row": Math.floor(mainPlayer.sprite.x / 16) })
    tilemap.displayMapArray('grid')

}

function move(e, player, tilemap) {
    //Move Left
    console.log('message', message)
    if (message != null) {
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
            console.log('temp', temp)
            if (temp.action) {
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

            if (temp.action) {
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

            if (temp.action) {
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

            if (temp.action) {
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




