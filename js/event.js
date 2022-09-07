class Event {
    constructor(message) {
        this.message = message;
        this.rect;
        this.container;
        this.text;
        this.bg;

        this.display();
    }

    display() {
        console.log('event')
        this.container = new PIXI.Container();
        console.log(this.container)
        this.bg  = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.text = new PIXI.Text(this.message, { fontFamily: 'Arial', fontSize: 24 });
        this.rect = new PIXI.Graphics()
            .beginFill(0xffff, 0)
            .lineStyle({ color: 0x0000, width: 5, native: true })
            .drawShape({ "x": 0, "y": 0, "width": app.stage.width / 1.5, "height": app.stage.height / 4, "type": 1 });

        this.rect.position.set(this.rect.width / 4, (app.stage.height - this.rect.height)-10)
        console.log(app.stage.width)
        //rect.tint(0xffff)
        
        this.bg.x = this.rect.x;
        this.bg.y = this.rect.y;
        this.bg.width = this.rect.width;
        this.bg.height = this.rect.height;
        this.bg.tint = 0xffffff;

        this.text.x = this.rect.x;
        this.text.y = this.rect.y;

        app.stage.addChild(this.container);

        this.container.addChild(this.bg)

        this.container.addChild(this.rect, this.text);
        console.log(this.rect)
        //rect._fillColor = 0xfffff;
    }

    destroy(){
        this.bg.destroy();
        this.container.destroy();
        this.text.destroy();
        this.rect.destroy();
        message = null;
    }
}