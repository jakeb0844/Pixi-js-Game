class Player {
    constructor(name = "", loader, app, container,  charObject) {
        this.name = '';
        //this.loader = loader;
        this.game = app;
        this.container = container;
        this.tilemap;
        this.walking = false;
        this.characterObject = charObject;
        

        //this.init();

    }

    /*
https://www.wargamer.com/dnd/stats#:~:text=The%20six%20D%26D%20stats%20are,to%20all%20kinds%20of%20rolls.
    Stats:
        Strength
        Dex
        Constituion
        Intelligence
        Wisdom
        Charisma

    */

    init() {

        this.loadAnimations();

        this.createSprites();
        (async () => {
            //Since sprites are being created in the loader callback
            //We have to wait for the sprites to be loaded
            //While the sprited has loaded, wait...
            while (this.spriteCreated != 1)
                await new Promise(resolve => setTimeout(resolve, 100));

            this.sprite = this.defaultAnimation;
            this.container.addChild(this.sprite)
            this.sprite.position.set(this.x, this.y)
        })();


    }

    loadAnimations() {
        this.loader.add('Walk_down', 'Borg_walk_down.json');
        this.loader.add('Walk_left', 'Borg_walk_left.json');
        this.loader.add('Walk_right', 'Borg_walk_right.json');
        this.loader.add('Walk_up', 'Borg_walk_up.json');
        this.loader.add('default', 'Borg-default.json');
    }

    createSprites() {

        let loader = this.loader.load((function () {
            this.defaultAnimation = this.createSprite(loader.resources.default);
            this.walkDownAnimation = this.createSprite(loader.resources.Walk_down);
            this.walkLeftAnimation = this.createSprite(loader.resources.Walk_left);
            this.walkRightAnimation = this.createSprite(loader.resources.Walk_right);
            this.walkUpAnimation = this.createSprite(loader.resources.Walk_up);
            

        }).bind(this));
    }

    createSprite(resources) {

        let size = Object.keys(resources.textures).length;

        const textures = [];

        for (let i = 0; i < size; i++) {

            const texture = PIXI.Texture.from(resources.name + "_" + i + ".png");
            textures.push(texture);

        }

        let sprite = new PIXI.AnimatedSprite(textures);

        sprite.play();
        sprite.animationSpeed = .1;

        this.spriteCreated = true;
        return sprite;

    }

    startWalking() {
        this.walking = true;
    }

    stopWalking() {
        this.walking = false;
    }

    

    changeAnimation(animation) {

        this.sprite = animation;
        this.container.removeChildren();
        this.container.addChild(this.sprite);
        this.sprite.position.set(this.x, this.y)
    }

}