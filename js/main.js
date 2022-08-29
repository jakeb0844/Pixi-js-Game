


// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 1600, height: 1600, transparent: false, antialis: true });
document.body.appendChild(app.view);

// Create the sprite and add it to the stage
const loader = PIXI.Loader.shared;
const container = new PIXI.Container();

app.stage.addChild(container);

//loader.add('tileset', 'Borg.json')
//loader.add('atlas', 'atlas.json');
//loader.add('assets','assets/maps/key.json');

let testSprite = new Player("Jake",loader,app,container);

let test = new TileMap(app);



//console.log(test)

var borgSprite;




//loader.load(loadChar);



//loaderl.load(testSprite.init)


// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    //container.rotation -= 0.01 * delta;
    testSprite.addSpriteToStage();
    testSprite.sprite.position.set(test.width / 2, test.height / 2);

});

function loadChar(loader, resources) {
    console.log(resources)
    const textures = [];
    //11 17 23

    for (let i = 0; i < 5; i++) {
        if (i != 5) {
            if (i != 11) {
                if (i != 17) {
                    if (i != 23) {
                        const texture = PIXI.Texture.from(i + ".png");
                        textures.push(texture);
                    }
                }


            }


        }
    }
    const borgSprite = PIXI.Texture.from('../Borg.png');
     //borgSprite = new PIXI.AnimatedSprite(borgSprite);
    // borgSprite.position.set(test.width / 2, test.height / 2);
    test.current_position = {"col":10,"row":15};
    test.mapArr[10][15].char_here = true;

    //borgSprite.scale.set(.8, .8);

    app.stage.addChild(borgSprite);

    borgSprite.play();
    borgSprite.animationSpeed = 0.1;

    app.stage.interactive = true;

    app.stage.on('click',function(e){
        console.log(e.data.global)
    });
}

function moveChar(e) {
    //console.log('e',e)
    //Move Left
    if (e.keyCode == 65) {
        if(check_if_walkable(e.keyCode,{"col" : test.current_position.col, "row":test.current_position.row - 1})){
            test.updateCharPosition({"col" : test.current_position.col, "row":test.current_position.row - 1})
            borgSprite.position.set(borgSprite.position._x - 16, borgSprite.position._y)
            //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
            console.log(test.current_position)
        
        }
        

    }
    //Move Right
    else if (e.keyCode == 68) {
        if(check_if_walkable(e.keyCode,{"col" : test.current_position.col, "row":test.current_position.row + 1})){
            test.updateCharPosition({"col" : test.current_position.col, "row":test.current_position.row + 1})
            borgSprite.position.set(borgSprite.position._x + 16, borgSprite.position._y)
            //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
            console.log(test.current_position)
        
        }
        
    }
    //Move Down
    else if (e.keyCode == 83) {
        if(check_if_walkable(e.keyCode,{"col" : test.current_position.col + 1, "row":test.current_position.row})){
            test.updateCharPosition({"col" : test.current_position.col + 1, "row":test.current_position.row})
            borgSprite.position.set(borgSprite.position._x, borgSprite.position._y + 16)
            //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
            console.log(test.current_position)
        
        }
        
    }
    else if (e.keyCode == 87) {
        if(check_if_walkable(e.keyCode,{"col" : test.current_position.col - 1, "row":test.current_position.row})){
            test.updateCharPosition({"col" : test.current_position.col -1 , "row":test.current_position.row})
            borgSprite.position.set(borgSprite.position._x, borgSprite.position._y - 16)
            //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
            console.log(test.current_position)
        
        }
        
    }
}

function check_if_walkable(keyCode,position){
    //let current_position = test.find_char_position();
    if(position.col > -1 && position.row > -1)

    if(test.mapArr[position.col][position.row].walkable){
        console.log(true)
        return true;
    }
    else{
        console.log(false)
        return false;
    }
    
    
}

$('body').on('keydown',moveChar);



console.log(loader)



