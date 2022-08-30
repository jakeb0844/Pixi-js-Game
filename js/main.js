// Create the application helper and add its render target to the page
const app = new PIXI.Application({
    width: 3000,
    height: 3000,
    transparent: false,
    antialis: true,
    resolution: 1
});
const loader = PIXI.Loader.shared;
const MapContainer = new PIXI.Container();
const PlayerContainer = new PIXI.Container();

document.body.appendChild(app.view);
// app.stage.scale.x = 2.2
// app.stage.scale.y = 3.7


//Add containers
app.stage.addChild(MapContainer);
app.stage.addChild(PlayerContainer);

//Create tilemap
let tilemap = new TileMap(app, MapContainer, '/assets/maps/map.png', '/assets/maps/map.json');

//Create Player
let mainPlayer = new Player("Jake", loader, app, PlayerContainer, tilemap);


// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    //container.rotation -= 0.01 * delta;

});

function move(e, player, tilemap) {
    //Move Left
    if (e.keyCode == 65) {
        //console.log("moveLeft")
        player.changeAnimation(player.walkLeftAnimation);
        if (tilemap.check_if_walkable({ "col": tilemap.current_position.col, "row": tilemap.current_position.row - 1 })) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col, "row": tilemap.current_position.row - 1 })
            player.sprite.position.set(player.x -= 16, player.y)

        }

    }
    //Move Right
    else if (e.keyCode == 68) {
        //console.log("move right")
        player.changeAnimation(player.walkRightAnimation);
        if (tilemap.check_if_walkable({ "col": tilemap.current_position.col, "row": tilemap.current_position.row + 1 })) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col, "row": tilemap.current_position.row + 1 })
            player.sprite.position.set(player.x += 16, player.y)

        }

    }
    // // //Move Down
    else if (e.keyCode == 83) {
        player.changeAnimation(player.walkDownAnimation);
        if (tilemap.check_if_walkable({ "col": tilemap.current_position.col + 1, "row": tilemap.current_position.row })) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col + 1, "row": tilemap.current_position.row })
            player.sprite.position.set(player.x, player.y += 16)

        }

    }
    else if (e.keyCode == 87) {
        player.changeAnimation(player.walkUpAnimation);
        if (tilemap.check_if_walkable({ "col": tilemap.current_position.col - 1, "row": tilemap.current_position.row })) {

            tilemap.updateCharPosition({ "col": tilemap.current_position.col - 1, "row": tilemap.current_position.row })
            player.sprite.position.set(player.x, player.y -= 16)

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




