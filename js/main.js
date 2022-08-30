


// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 600, height: 300, transparent: false, antialis: true });
document.body.appendChild(app.view);
// app.stage.scale.x = 2.2
// app.stage.scale.y = 3.7

var borgSprite;

// Create the sprite and add it to the stage
const loader = PIXI.Loader.shared;
const container = new PIXI.Container();
const container2 = new PIXI.Container();

app.stage.addChild(container);
app.stage.addChild(container2);

//loader.add('tileset', 'Borg.json')
//loader.add('atlas', 'atlas.json');
//loader.add('assets','assets/maps/key.json');

let testSprite = new Player("Jake",loader,app,container2);

let test = new TileMap(app,container);

//container2.addChild(testSprite.sprite)


//loader.load(loadChar);

// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    //container.rotation -= 0.01 * delta;
    
    

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
    borgSprite = PIXI.Texture.from('/Borg.png');
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

$('body').on('keydown',testSprite.move);

// app.stage.x = -testSprite.x
// app.stage.y = -testSprite.y



console.log(loader)



