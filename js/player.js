class Player {
    constructor(name = "", loader, app,container) {
        this.name = '';
        this.loader = loader;
        this._game = app;
        this.sprite;
        this.texture;
        this.container = container;

        this.init();
        //this.loadChar();

    }

    init() {
        //Load charcter json
        //this.loader.add('Borg', 'Borg.json');
        this.texture = PIXI.Texture.from("Borg.png");

        var text = new PIXI.Texture(this.texture, new PIXI.Rectangle(0, 0, 16, 16));
        var layer = new PIXI.Sprite(text);
        
        //var layer = PIXI.Sprite.from('assets/sprites/Characters/Champions/Börg.png')
        //layer.anchor.set(0.5)
        layer.x = 240;
        layer.y = 50;
        // layer.zIndex = 100;
        // layer._zIndex = 100;
        // console.log('layer x',layer.x);
        // console.log('layer y',layer.y);
        // console.log('')
        this.sprite = layer;
        //this.container.addChild(layer)
        // this._game.stage.addChild(layer);
    }

    addSpriteToStage(){
        this._game.stage.addChild(this.sprite);
    }

    move(){

    }

    loadChar() {
        //console.log(resources)
        const textures = [];
        //11 17 23

        for (let i = 0; i < 1; i++) {
            if (i != 5) {
                if (i != 11) {
                    if (i != 17) {
                        if (i != 23) {
                            const texture = PIXI.Texture.from("borg.png");
                            textures.push(texture);
                        }
                    }


                }


            }
        }
        //const borgTexture = PIXI.Texture.from('00.png');
        borgSprite = new PIXI.AnimatedSprite(textures);
        borgSprite.position.set(test.width / 2, test.height / 2);
        //test.current_position = { "col": 10, "row": 15 };
        //test.mapArr[10][15].char_here = true;

        //borgSprite.scale.set(.8, .8);

        app.stage.addChild(borgSprite);

        borgSprite.play();
        borgSprite.animationSpeed = 0.1;

        app.stage.interactive = true;

        app.stage.on('click', function (e) {
            console.log(e.data.global)
        });
    }


}