class Player {
    constructor(name = "", loader, app, container, tilemap) {
        this.name = '';
        this.loader = loader;
        this.game = app;
        this.sprite;
        this.texture;
        this.container = container;
        this.x = 240;
        this.y = 160;
        this.walkDownAnimation;
        this.animationTextures;
        this.test = false;
        this.tilemap = tilemap;

        this.init();
        //this.loadChar();

    }

    load_animations() {
        this.loader.add('Walk_down', 'Borg_walk_down.json');
        this.loader.add('Walk_left', 'Borg_walk_left.json');
        this.loader.add('Walk_right', 'Borg_walk_right.json');
        this.loader.add('Walk_up', 'Borg_walk_up.json');
    }

    createSprites() {

        let loader = this.loader.load((function () {
            console.log(loader)

            this.walkDownAnimation = this.createWalkSprite(loader.resources.Walk_down)
            this.walkLeftAnimation = this.createWalkSprite(loader.resources.Walk_left)
            this.walkRightAnimation = this.createWalkSprite(loader.resources.Walk_right)
            this.walkUpAnimation = this.createWalkSprite(loader.resources.Walk_up)


        }).bind(this));
    }

    createWalkSprite(resources) {

        let size = Object.keys(resources.textures).length;

        const textures = [];

        for (let i = 0; i < size; i++) {

            const texture = PIXI.Texture.from(resources.name + "_" + i + ".png");
            textures.push(texture);

        }

        let sprite = new PIXI.AnimatedSprite(textures);

        sprite.play();
        sprite.animationSpeed = .1;

        this.test = true;
        return sprite;

    }



    init() {

        this.load_animations();

        this.createSprites();
        (async () => {
            console.log("waiting for variable");
            while (this.test != 1) // define the condition as you like
                await new Promise(resolve => setTimeout(resolve, 100));
            PIXI.utils.clearTextureCache();
            //console.log("variable is defined");
            //console.log(this.test)
            this.sprite = this.walkDownAnimation;
            this.container.addChild(this.sprite)
            this.sprite.position.set(this.x, this.y)
        })();


    }

    changeAnimation(animation) {

        this.sprite = animation;
        this.container.removeChildren();
        this.container.addChild(this.sprite);
        this.sprite.position.set(this.x, this.y)
    }

}