class Character {
    constructor(name = "", loader, app, container, startPosition = { "x": 240, "y": 160 }, type, stats) {
        this.name = name;
        this.loader = loader;
        this.game = app;
        this.sprite;
        this.container = container;
        this.x = startPosition.x;
        this.y = startPosition.y;
        this.spriteCreated = false;

        this.animations = {
            "default": null,
            "up": null,
            "down": null,
            "left": null,
            "right": null,
            "attack-up": null,
            "attack-down": null,
            "attack-left": null,
            "attack-right": null,
        }

        this.init();

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

            this.sprite = this.animations.default;
            this.container.addChild(this.sprite)
            this.sprite.position.set(this.x, this.y)
        })();


    }

    createPlayer() {
        return new Player(this.name, this.loader, this.app, this.container, this)
    }

    createEnemy() {
        return new Enemy(this.name, this.loader, this.app, this.container, this)
    }

    loadAnimations() {

        this.loader.add('Walk_down', 'Borg_walk_down.json')
            .add('Walk_left', 'Borg_walk_left.json')
            .add('Walk_right', 'Borg_walk_right.json')
            .add('Walk_up', 'Borg_walk_up.json')
            this.loader.add('default', this.name + '-default.json');

    }

    createSprites() {
        // this.loader.onProgress.add(showProgress);
        // this.loader.onComplete.add(doneLoading);

        let loader = this.loader.load((function () {
            this.animations.default = this.createSprite(loader.resources.default);
            this.animations.down = this.createSprite(loader.resources.Walk_down);
            this.animations.left = this.createSprite(loader.resources.Walk_left);
            this.animations.right = this.createSprite(loader.resources.Walk_right);
            this.animations.up = this.createSprite(loader.resources.Walk_up);

            //this.loader.reset();


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