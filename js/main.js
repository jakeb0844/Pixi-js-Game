// Create the application helper and add its render target to the page
const app = new PIXI.Application({
    width: 480,
    height: 360,
    transparent: false,
    antialis: true,
    resolution: 1
});
const loader = PIXI.Loader.shared;
const EnemyLoader = new PIXI.Loader;

const MapContainer = new PIXI.Container();
const PlayerContainer = new PIXI.Container();
const EnemyContainer = new PIXI.Container();
const Container = new PIXI.Container();

var message;
var loading = false;

document.body.appendChild(app.view);
// app.stage.scale.x = 2.2
// app.stage.scale.y = 3.7


//Add containers
app.stage.addChild(MapContainer);
app.stage.addChild(PlayerContainer);
app.stage.addChild(EnemyContainer);
app.stage.addChild(Container)

//loader.onProgress.add(showProgress);
let tilemap;

//Create Character
let playerChar = new Character("Borg", loader, app, PlayerContainer, tilemap, { "x": 240, "y": 160 });

//Create Player
// let mainPlayer = new Player("Jake", loader, app, PlayerContainer,{"x": 240, "y": 160});
let mainPlayer = playerChar.createPlayer();
let EnemyChar = new Character("Orc", EnemyLoader, app, EnemyContainer, tilemap, { "x": 176, "y": 160 });

//Create tilemap
tilemap = new TileMap(app, MapContainer, '/assets/maps/map.png', '/assets/maps/map.json', { "x": mainPlayer.characterObject.x, "y": mainPlayer.characterObject.y });
tilemap.player = mainPlayer;

//Wait for everything to load
setTimeout(() => {
    tilemap.addChild(EnemyChar)
    
  }, "100")



let walkX = null;
let walkY = null;
let index = 0;

// Listen for animate update
app.ticker.add((delta) => {
    
    movePlayer();

    if (EnemyChar.sprite) {
        let row = Math.floor(EnemyChar.sprite.x / 16);
        let col = Math.floor(EnemyChar.sprite.y / 16);
        if(!tilemap.gridObj.grid[col][row+1].wall){
            //console.log('here')
            EnemyChar.sprite.x++
            tilemap.gridObj.printGrid()
        }
        else{
            //console.log(tilemap.gridObj.grid[col][row-1].wall)
            while(EnemyChar.sprite.x > 16){
                console.log('here')
                EnemyChar.sprite.x--;
            }
        }
    }

});



function movePlayer() {

    if (mainPlayer.walking) {
        if (index < tilemap.path.length) {

            let node = tilemap.path[index];
            let walkY = node.row * tilemap.tileWidth;
            let walkX = node.col * tilemap.tileHeight;

            //Walk speed needs to be a divider of 16
            let walkSpeed = 2;

            tilemap.updateCharPosition({ "col": Math.floor(mainPlayer.characterObject.sprite.y / 16), "row": Math.floor(mainPlayer.characterObject.sprite.x / 16) })
            tilemap.gridObj.printGrid('grid')

            if (mainPlayer.characterObject.sprite.y != walkY) {

                if (walkY > mainPlayer.characterObject.sprite.y) {
                    mainPlayer.characterObject.changeAnimation(mainPlayer.characterObject.animations.down);
                    mainPlayer.characterObject.sprite.y += walkSpeed;
                    mainPlayer.characterObject.y += walkSpeed;
                }
                else {
                    mainPlayer.characterObject.changeAnimation(mainPlayer.characterObject.animations.up);
                    mainPlayer.characterObject.sprite.y -= walkSpeed;
                    mainPlayer.characterObject.y -= walkSpeed;
                }
            }

            else if (mainPlayer.characterObject.sprite.x != walkX) {

                if (mainPlayer.characterObject.sprite.x != walkX) {

                    if (walkX > mainPlayer.characterObject.sprite.x) {
                        mainPlayer.characterObject.changeAnimation(mainPlayer.characterObject.animations.right);
                        mainPlayer.characterObject.sprite.x += walkSpeed;
                        mainPlayer.characterObject.x += walkSpeed;
                    }
                    else {
                        mainPlayer.characterObject.changeAnimation(mainPlayer.characterObject.animations.left);
                        mainPlayer.characterObject.sprite.x -= walkSpeed;
                        mainPlayer.characterObject.x -= walkSpeed;
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
            mainPlayer.characterObject.changeAnimation(mainPlayer.characterObject.animations.default)
        }

    }
    else {
        index = 0;
    }
}

let rect = new PIXI.Graphics()
    .beginFill(0xFFFFFFF0000)
    .lineStyle({ color: 1, width: 1, native: true })
    .drawShape({ "x": 2.5, "y": app.view.height - 38, "width": app.view.width - 5, "height": 35, "type": 1 });


Container.addChild(rect)


let rect1 = new PIXI.Graphics()
    .beginFill(0xFFFff)
    .lineStyle({ color: 1, width: 1, native: true })
    .drawShape({ "x": rect.getBounds().x, "y": rect.getBounds().y, "width": 32, "height": 32, "type": 1 });

Container.addChild(rect1)



