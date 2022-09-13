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
const TileContainer = new PIXI.Container();
const PlayerContainer = new PIXI.Container();
const EnemyContainer = new PIXI.Container();
const Container = new PIXI.Container();

var message;
var loading = false;
const walkSpeed = 2;

document.body.appendChild(app.view);
// app.stage.scale.x = 2.2
// app.stage.scale.y = 3.7


//Add containers
app.stage.addChild(MapContainer);
app.stage.addChild(TileContainer);
app.stage.addChild(PlayerContainer);
app.stage.addChild(EnemyContainer);
//app.stage.addChild(Container)

//loader.onProgress.add(showProgress);
let tilemap;

//Create Character
let mainPlayer = new Player("Borg", loader, app, PlayerContainer,null, {"x": 240, "y": 128});

//Create Enemy
let EnemyChar = new Enemy("Orc", EnemyLoader, app, EnemyContainer,null, { "x": 176, "y": 160 });

//Create tilemap
tilemap = new TileMap(app, MapContainer, TileContainer, '/assets/maps/map.png', '/assets/maps/map.json', { "x": 240, "y": 128 });
tilemap.player = mainPlayer;

//Wait for everything to load
setTimeout(() => {
    tilemap.addChild(EnemyChar)
    tilemap.gridObj.printGrid('grid')
	
	//mainPlayer.sprite.interactive = true;
    
  }, "100")


//Add default cursor
const hoverIcon = "url('mini-sword.png'),auto";
app.renderer.plugins.interaction.cursorStyles.hover = hoverIcon;



// mainPlayer.cursor = 'hover';

function attack(){
	//player is one tile away from enemy, and clicked on enemy, attack
	if(mainPlayer.x == EnemyChar.x - 16){
		let damage = mainPlayer.attack(EnemyChar)
		EnemyChar.stats.hp -= damage;
	}
	
}


let walkX = null;
let walkY = null;
let index = 0;

// Listen for animate update
app.ticker.add((delta) => {

	attack();
    
    movePlayer();

	if(EnemyChar.sprite){
		EnemyChar.sprite.interactive = true;
		EnemyChar.sprite.buttonMode = true;
		EnemyChar.sprite.cursor = 'hover';
	}

    // if (EnemyChar.sprite) {
    //     let {row, col} = CalculateRowAndCol({"x":EnemyChar.sprite.x,"y":EnemyChar.sprite.y});
    //     let grid = tilemap.gridObj.grid;

    //     if(EnemyChar.path.length == 0){
            
            
    //         //Find path
    //         //If at the very far right of the path, go to the start
    //         if(row == grid[0].length - 1){
    //             let di = new Dijkstra(grid,grid[col][row],grid[col][0])
    //             let path = di.find_path(grid,di.startNode,di.endNode)
    //             //console.log(di.makePath(path.endNode))
    //             if(path != null){
    //                 EnemyChar.path = di.makePath(path.endNode)
    //             }
                
    //         }
    //         else if(row == 0){
    //             let di = new Dijkstra(grid,grid[col][row],grid[col][28])
    //             let path = di.find_path(grid,di.startNode,di.endNode)
    //             //console.log(di.makePath(path.endNode))
    //             if(path != null){
    //                 EnemyChar.path = di.makePath(path.endNode)
    //             }
                
    //         }
    //         else{
    //             let di = new Dijkstra(grid,grid[col][row],grid[col][0])
    //             let path = di.find_path(grid,di.startNode,di.endNode)
    //             //console.log(di.makePath(path.endNode))
    //             if(path != null){
    //                 EnemyChar.path = di.makePath(path.endNode)
    //             }
                
    //         }
            
    //     }
    //     else{
    //         //Move Enemy along path
    //         let node = EnemyChar.path[0];
    //         let walkY = node.row * tilemap.tileWidth;
    //         let walkX = node.col * tilemap.tileHeight;
    //         //console.log(EnemyChar.path)
    //         //tilemap.updateCharPosition({ "col": Math.floor(mainPlayer.sprite.y / 16), "row": Math.floor(mainPlayer.sprite.x / 16) })
    //         tilemap.gridObj.grid[node.row][node.col].enemeyPosition = true;
    //         tilemap.gridObj.grid[col][row].enemeyPosition = false;
    //         tilemap.gridObj.printGrid('grid')

    //         if(EnemyChar.sprite.y != walkY){
    //             if (walkY > EnemyChar.sprite.y) {
    //                EnemyChar.changeAnimation(EnemyChar.animations.down);
    //                 EnemyChar.sprite.y += walkSpeed;
    //                 EnemyChar.y += walkSpeed;
    //             }
    //             else {
    //                 EnemyChar.changeAnimation(EnemyChar.animations.up);
    //                 EnemyChar.sprite.y -= walkSpeed;
    //                 EnemyChar.y -= walkSpeed;
    //             }
    //         }
    //         else if (EnemyChar.sprite.x != walkX) {

    //             if (EnemyChar.sprite.x != walkX) {

    //                 if (walkX > EnemyChar.sprite.x) {
    //                     EnemyChar.changeAnimation(EnemyChar.animations.right);
    //                     EnemyChar.sprite.x += walkSpeed;
    //                     EnemyChar.x += walkSpeed;
    //                 }
    //                 else {
    //                     EnemyChar.changeAnimation(EnemyChar.animations.left);
    //                     EnemyChar.sprite.x -= walkSpeed;
    //                     EnemyChar.x -= walkSpeed;
    //                 }

    //             }
    //             else {
    //                 walkX = null;
    //             }
    //         }
    //         else {

    //             //tilemap.path[index].tile.clear()
    //             //EnemyChar.pathIndex++
    //             EnemyChar.path.shift()

    //         }
    //     }
    
    // }

});



function movePlayer() {

    if (mainPlayer.walking) {
        if (index < tilemap.path.length) {

            let node = tilemap.path[index];
            let walkY = node.row * tilemap.tileWidth;
            let walkX = node.col * tilemap.tileHeight;

            //Walk speed needs to be a divider of 16
            //let walkSpeed = 2;

            tilemap.updateCharPosition({ "col": Math.floor(mainPlayer.sprite.y / 16), "row": Math.floor(mainPlayer.sprite.x / 16) })
            tilemap.gridObj.printGrid('grid')

            if (mainPlayer.sprite.y != walkY) {

                if (walkY > mainPlayer.sprite.y) {
                    mainPlayer.changeAnimation(mainPlayer.animations.down);
                    mainPlayer.sprite.y += walkSpeed;
                    mainPlayer.y += walkSpeed;
                }
                else {
                    mainPlayer.changeAnimation(mainPlayer.animations.up);
                    mainPlayer.sprite.y -= walkSpeed;
                    mainPlayer.y -= walkSpeed;
                }
            }

            else if (mainPlayer.sprite.x != walkX) {

                if (mainPlayer.sprite.x != walkX) {

                    if (walkX > mainPlayer.sprite.x) {
                        mainPlayer.changeAnimation(mainPlayer.animations.right);
                        mainPlayer.sprite.x += walkSpeed;
                        mainPlayer.x += walkSpeed;
                    }
                    else {
                        mainPlayer.changeAnimation(mainPlayer.animations.left);
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
            mainPlayer.changeAnimation(mainPlayer.animations.default)
        }

    }
    else {
        index = 0;
    }
}

$(document).on('keyup', function (e) {
    console.log(e)
    if(e.key == "Escape"){
        //show esc window
        doPause();

    }
})

function doPause(){
    
    //wait for rect to render
    if(PIXI.Ticker._shared.speed > 0){
        PIXI.Ticker._shared.speed=0;
        let menu = createRect(120, 50,app.stage.width/2,app.stage.height/2)
        let text = new PIXI.Text('Resume',{fontFamily : 'Arial', fontSize: 12, fill : 0xff1010});
        text.position.set(menu.width/2 , menu.height/2);
        text.interactive = true;
        text.buttonMode = true;

        text.on('click',function(){
            PIXI.Ticker._shared.speed=1;
            Container.removeChildren();
        })
        menu.addChild(text)
        Container.addChild(menu);
        }
        else{
            PIXI.Ticker._shared.speed=1;
            Container.removeChildren();
        }
    
    
}

// let rect = new PIXI.Graphics()
//     .beginFill(0xFFFFFFF0000)
//     .lineStyle({ color: 1, width: 1, native: true })
//     .drawShape({ "x": 2.5, "y": app.view.height - 38, "width": app.view.width - 5, "height": 35, "type": 1 });


// Container.addChild(rect)


// let rect1 = new PIXI.Graphics()
//     .beginFill(0xFFFff)
//     .lineStyle({ color: 1, width: 1, native: true })
//     .drawShape({ "x": rect.getBounds().x, "y": rect.getBounds().y, "width": 32, "height": 32, "type": 1 });

// Container.addChild(rect1)



