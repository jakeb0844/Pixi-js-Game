class Player {
    constructor(name = "", loader, app, container) {
        this.name = '';
        this.loader = loader;
        this._game = app;
        this.sprite;
        this.texture;
        this.container = container;
        this.x = 240;
        this.y = 160;
        this.walkDownAnimation;
        this.animationTextures;
        this.test = false;

        this.init();
        //this.loadChar();

    }

    load_animations() {
        this.loader.add('Walk_down', 'Borg_walk_down.json');
        this.loader.add('Walk_left', 'Borg_walk_left.json');
        this.loader.add('Walk_right','Borg_walk_right.json');
        this.loader.add('Walk_up','Borg_walk_up.json');
    }

 createSprites() {
        
        let loader = this.loader.load((function(){
            console.log(loader)

            this.walkDownAnimation = this.createWalkSprite(loader.resources.Walk_down)
            this.walkLeftAnimation = this.createWalkSprite(loader.resources.Walk_left)
            this.walkRightAnimation = this.createWalkSprite(loader.resources.Walk_right)
            this.walkUpAnimation = this.createWalkSprite(loader.resources.Walk_up)
            
            
        }).bind(this));
    }

    createWalkSprite(resources) {
       //console.log(resources)
        
        let size = Object.keys(resources.textures).length;
        //console.log(size)

        const textures = [];

        for (let i = 0; i < size; i++) {

            const texture = PIXI.Texture.from(resources.name + "_" +i + ".png");
            textures.push(texture);

        }
        //const borgTexture = PIXI.Texture.from('00.png');
        let sprite = new PIXI.AnimatedSprite(textures);
        //this.walkAnimation.position.set(test.width / 8, test.height / 2);
        //test.current_position = { "col": 10, "row": 15 };
        //test.mapArr[10][15].char_here = true;

        //borgSprite.scale.set(.8, .8);

        //app.stage.addChild(borgSprite);

        sprite.play();
        sprite.animationSpeed = 0.1;
        // testSprite.container.addChild(testSprite.walkAnimation)
        this.test = true;
        return sprite;
        
    }

    

    init() {

        this.load_animations();

        this.createSprites();
        (async() => {
            console.log("waiting for variable");
            while(this.test != 1) // define the condition as you like
                await new Promise(resolve => setTimeout(resolve, 100));
            PIXI.utils.clearTextureCache();
            console.log("variable is defined");
            console.log(this.test)
            this.sprite = this.walkDownAnimation;
            this.container.addChild(this.sprite)
            this.sprite.position.set(this.x,this.y)
        })();
        

    }

    changeAnimation(animation){
    
        this.sprite = animation;
        this.container.removeChildren();
        this.container.addChild(this.sprite);
        this.sprite.position.set(this.x,this.y)
    }

    move(e) {
        //console.log('e',e)
        //Move Left
        if (e.keyCode == 65) {
            console.log("moveLeft")
            testSprite.changeAnimation(testSprite.walkLeftAnimation);
            if (check_if_walkable(e.keyCode, { "col": test.current_position.col, "row": test.current_position.row - 1 })) {
                
                test.updateCharPosition({ "col": test.current_position.col, "row": test.current_position.row - 1 })
                testSprite.sprite.position.set(testSprite.x -= 16, testSprite.y)
                //testSprite._game.stage.x += 100
                //testSprite.addSpriteToStage();
                //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
                //console.log(test.current_position)

            }


        }
        //Move Right
        else if (e.keyCode == 68) {
            testSprite.changeAnimation(testSprite.walkRightAnimation);
            if (check_if_walkable(e.keyCode, { "col": test.current_position.col, "row": test.current_position.row + 1 })) {
                test.updateCharPosition({ "col": test.current_position.col, "row": test.current_position.row + 1 })
                testSprite.sprite.position.set(testSprite.x += 16, testSprite.y)
                //testSprite._game.stage.x -= 100
                //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
                //console.log(test.current_position)

            }

        }
        // //Move Down
        else if (e.keyCode == 83) {
            testSprite.changeAnimation(testSprite.walkDownAnimation);
            if (check_if_walkable(e.keyCode, { "col": test.current_position.col + 1, "row": test.current_position.row })) {
                
                test.updateCharPosition({ "col": test.current_position.col + 1, "row": test.current_position.row })
                testSprite.sprite.position.set(testSprite.x, testSprite.y += 16)
                //testSprite._game.stage.y -= 100
                //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
                //console.log(test.current_position)

            }

        }
        else if (e.keyCode == 87) {
            testSprite.changeAnimation(testSprite.walkUpAnimation);
            if (check_if_walkable(e.keyCode, { "col": test.current_position.col - 1, "row": test.current_position.row })) {
                test.updateCharPosition({ "col": test.current_position.col - 1, "row": test.current_position.row })
                testSprite.sprite.position.set(testSprite.x, testSprite.y -= 16)
                //testSprite._game.stage.y += 100
                //test.current_position = {"col" : test.current_position.col, "row":test.current_position.row - 1}
                //console.log(test.current_position)

            }

        }

        // testSprite._game.stage.x -= 100
        // testSprite._game.stage.y -= 100
    }


}