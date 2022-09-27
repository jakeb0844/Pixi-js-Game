export class Entity {
    constructor(name = "", app, loader, container, tilemap, startPosition = { "x": 240, "y": 160 }, type, stats) {
        this.name = name;
        this.loader = loader;
        this.game = app;
        this.tilemap = tilemap;
        this.sprite;
        this.container = container;
        this.x = startPosition.x;
        this.y = startPosition.y;
        this.spriteCreated = false;
        this.path = [];
        this.turn = true;
        this.currentNode = null;

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

        // this.loadAnimations();

        this.createSprites();

        this.sprite = this.animations.default;
        this.container.addChild(this.sprite)
        this.sprite.position.set(this.x, this.y)


    }

    createSprites() {
        console.log(this.name)
        let json = this.loader.getAsset(this.name + '.json');
        let png = this.loader.getAsset(this.name + '.png');
        let asset = '';
        //console.log(json)
        if (json) {
            console.log('json')
            asset = this.loader.getAsset(this.name + '.json');
            this.animations.default = this.createSprite(this.name + '-walk-forward', asset);
            this.animations.down = this.createSprite(this.name + '-walk-backward', asset);
            this.animations.left = this.createSprite(this.name + '-walk-left', asset);
            this.animations.right = this.createSprite(this.name + '-walk-right', asset);
            this.animations.up = this.createSprite(this.name + '-walk-forward', asset);
        }
        else {
            console.log('no json')
            asset = this.loader.getAsset(this.name + '.png');
            //console.log(asset)
            //Get the first image of the sprite sheet
            let texture = new PIXI.Texture(asset.resource.texture, new PIXI.Rectangle(0,0,16,16));

            let sprite = new PIXI.Sprite(texture)
            this.animations.default = sprite;
        }

        // let asset = this.loader.getAsset(this.name + '.json');
        // this.animations.default = this.createSprite(this.name + '-walk-forward', asset);
        // this.animations.down = this.createSprite(this.name + '-walk-backward', asset);
        // this.animations.left = this.createSprite(this.name + '-walk-left', asset);
        // this.animations.right = this.createSprite(this.name + '-walk-right', asset);
        // this.animations.up = this.createSprite(this.name + '-walk-forward', asset);

    }

    createSprite(animation_name, resources) {

        if (resources.resource.spritesheet.animations) {
            let animation = resources.resource.spritesheet.animations[animation_name];

            try {
                let sprite = new PIXI.AnimatedSprite(animation);
                sprite.play();
                sprite.animationSpeed = .1;

                return sprite;
            }
            catch (e) {
                console.log(e);
            }

        }

        return null;

    }

    updatePosition(position) {
        if (position.x) {
            this.sprite.x = position.x;
            this.x = position.x;
        }

        if (position.y) {
            this.sprite.y = position.y;
            this.y = position.y;
        }


    }



    changeAnimation(animation) {

        this.sprite = animation;
        this.container.removeChildren();
        this.container.addChild(this.sprite);
        this.sprite.position.set(this.x, this.y)
    }

}