export class Entity {
    constructor(name = "", app, loader, container, tilemap, startPosition = { "x": 240, "y": 160 }, type, stats={'str':5,'def':3,'health':10}) {
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
        this.containerIndex;
        this.stats = stats;

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

        this.createSprites();

        this.sprite = this.animations.default;
        this.addChildToContainer();
        //this.container.addChild(this.sprite)

        this.sprite.position.set(this.x, this.y)


    }

    addChildToContainer() {

        if (this.containerIndex == null) {
            let len = this.container.children.length;
            this.containerIndex = len;
            this.container.addChildAt(this.sprite, len);
        }
        else {
            this.container.addChildAt(this.sprite, this.containerIndex);
        }



    }

    removeChildFromContainer() {
        this.container.removeChildAt(this.containerIndex)
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
            let texture = new PIXI.Texture(asset.resource.texture, new PIXI.Rectangle(0, 0, 16, 16));

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

    attack(enemy){
        let damage = this.stats.str - enemy.stats.def;

        return damage;
    }

    centerEntityInTile() {
        let playerX = Math.floor(this.sprite.x / 16) * 16;
        let playerY = Math.floor(this.sprite.y / 16) * 16;

        this.sprite.x = playerX;
        this.sprite.y = playerY;
        this.x = playerX;
        this.y = playerY;
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

    doesAnimationExist(animation) {
        if (animation != undefined || animation != null) {
            console.log('animation exists')
            return true;
        }
        console.log('animation does not exist')
        return false;
    }

    changeAnimation(animation) {

        console.log('animation', animation);

        if (this.doesAnimationExist(animation)) {
            this.sprite = animation;
        }
        else {
            //this.sprite = this.animations.default;
        }

        //this.sprite = animation;
        this.removeChildFromContainer();
        this.addChildToContainer()
        //this.container.addChild(this.sprite);
        this.sprite.position.set(this.x, this.y)
    }

    walk(tilemap) {
        console.log('entity', this.name);
        //console.log('len',entity.path.length)
        //let node = entity.path[index];
        if (this.currentNode == null) {
            this.currentNode = this.path.shift()
            // console.log('len',entity.path.length)
        }
        let node = this.currentNode;
        let walkY = node.row * tilemap.tileWidth;
        let walkX = node.col * tilemap.tileHeight;
        let walkSpeed = 2;

        //tilemap.updateCharPosition({ "col": Math.floor(this.sprite.y / 16), "row": Math.floor(this.sprite.x / 16) })
        //printGrid(tilemap.grid, 'grid')

        if (this.sprite.y != walkY) {

            if (walkY > this.sprite.y) {
                this.changeAnimation(this.animations.up);
                this.sprite.y += walkSpeed;;
                this.y += walkSpeed;
            }
            else {
                this.changeAnimation(this.animations.down);
                this.sprite.y -= walkSpeed;
                this.y -= walkSpeed;
            }
        }

        else if (this.sprite.x != walkX) {

            if (walkX > this.sprite.x) {
                this.changeAnimation(this.animations.right);
                this.sprite.x += walkSpeed;
                this.x += walkSpeed;
            }
            else {
                this.changeAnimation(this.animations.left);
                this.sprite.x -= walkSpeed;
                this.x -= walkSpeed;
            }
        }

        let x = this.sprite.x;
        let y = this.sprite.y;
        //console.log("x:" + x + ' and walkX:' + walkX);
        //console.log("y:" + y + ' and walkY:' + walkY);
        if (x != walkX || y != walkY) {
            //entity.path[index].tile.clear()
            console.log('keepWalking')
            return true;
        }
        else {
            if (this.constructor.name == 'Player') {
                this.currentNode.tile.clear()
                this.tilemap.updateCharPosition({ "col": Math.floor(this.sprite.y / 16), "row": Math.floor(this.sprite.x / 16) })
                printGrid(this.tilemap.grid, 'grid')
                //console.log(this.currentNode)
            }
            else {
                this.tilemap.updateEnemyPosition({ "col": Math.floor(this.sprite.y / 16), "row": Math.floor(this.sprite.x / 16) })

                printGrid(this.tilemap.grid, 'grid')
            }

            console.log('finished walking')
            this.currentNode = this.path.shift();
            //console.log('node',entity.currentNode)
            //index++;
            //console.log('index',index)
            //console.log('len2',entity.path.length)

            if (this.currentNode == undefined) {
                this.walking = false;
                this.path = [];
                this.currentNode = null;
                //index = 0;
                this.changeAnimation(this.animations.default)

            }
        }

        return false;
    }
}