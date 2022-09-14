import { PreLoader } from "./loader.js";

const app = new PIXI.Application({
    width: 480,
    height: 320,
    transparent: false,
    antialis: true,
    resolution: 1
});

document.body.appendChild(app.view);

var loader = new PreLoader(app);
loader.load(setup);

function setup(e){
    //Create a class that stores all textures from here or even creates the textures and animations;;;
    //How do we find out what each texture is called?

    console.log(e);

    let size = getObjectSize(e.resources)
    let keys = getObjectKeys(e.resources);

    for(let i = 0; i < size; i++) {
        loader.saveAssets({
            "name": keys[i],
            "resource": e.resources[keys[i]],
        });
    }

    console.log(loader);
    
    // let sheet = e.resources["Börg.json"].spritesheet;
    // console.log(sheet)

    // // create an animated sprite
    // let animatedCapguy = new PIXI.AnimatedSprite(sheet.animations["Börg-attack-forward"]);
    
    // // set speed, start playback and add it to the stage
    // animatedCapguy.animationSpeed = 0.1;
    // animatedCapguy.play();
    // animatedCapguy.x = app.view.width / 2;
    // animatedCapguy.y = app.view.height / 2;
    // app.stage.addChild(animatedCapguy);

 }
