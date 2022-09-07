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

//Create Player
let mainPlayer = new Player("Jake", loader, app, PlayerContainer,{"x": 32, "y": 32});

//Create tilemap
let tilemap = new TileMap(app, MapContainer, '/assets/maps/dungeon.png', '/assets/maps/dungeon.json', {"x": mainPlayer.x,"y": mainPlayer.y});
tilemap.player = mainPlayer;



let walkX = null;
let walkY = null;
let index = 0;

// Listen for animate update
app.ticker.add((delta) => {

    if (mainPlayer.walking) {
        if (index < tilemap.path.length) {

            let node = tilemap.path[index];
            let walkY = node.row * tilemap.tileWidth;
            let walkX = node.col * tilemap.tileHeight;
            let walkSpeed = 1;

            tilemap.updateCharPosition({ "col": Math.floor(mainPlayer.sprite.y / 16), "row": Math.floor(mainPlayer.sprite.x / 16) })
            tilemap.gridObj.printGrid('grid')

            if (mainPlayer.sprite.y != walkY) {

                if (walkY > mainPlayer.sprite.y) {
                    mainPlayer.changeAnimation(mainPlayer.walkDownAnimation);
                    mainPlayer.sprite.y += walkSpeed;;
                    mainPlayer.y += walkSpeed;
                }
                else {
                    mainPlayer.changeAnimation(mainPlayer.walkUpAnimation);
                    mainPlayer.sprite.y -= walkSpeed;
                    mainPlayer.y -= walkSpeed;
                }
            }

            else if (mainPlayer.sprite.x != walkX) {

                if (mainPlayer.sprite.x != walkX) {

                    if (walkX > mainPlayer.sprite.x) {
                        mainPlayer.changeAnimation(mainPlayer.walkRightAnimation);
                        mainPlayer.sprite.x += walkSpeed;
                        mainPlayer.x += walkSpeed;
                    }
                    else {
                        mainPlayer.changeAnimation(mainPlayer.walkLeftAnimation);
                        mainPlayer.sprite.x -= walkSpeed;
                        mainPlayer.x -= walkSpeed;
                    }

                }
                else {
                    walkX = null;
                }
            }
            else {

                tilemap.path[index].tile.clear()
                index++

            }

        }
        else {
            mainPlayer.stopWalking()
            tilemap.path = [];
            mainPlayer.changeAnimation(mainPlayer.defaultAnimation)
        }

    }
    else {
        index = 0;
    }

});
