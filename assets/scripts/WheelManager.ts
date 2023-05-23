import { _decorator, Animation, color, Color, Component, easing, Graphics, instantiate, loader, Material, Node, ParticleSystem2D, Prefab, Rect, Sprite, SpriteFrame, Tween, TweenAction, TweenSystem, UIOpacity, UITransform, v2, Vec2, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('WheelManager')
export class WheelManager extends Component {
    @property({ type: Prefab })
    line: Prefab = null
    @property({ type: Prefab })
    square: Prefab = null
    @property({ type: Prefab })
    diamond: Prefab = null
    @property({ type: Prefab })
    bulb: Prefab = null
    @property({ type: Node })
    wedgeNode: Node = null
    @property({ type: Node })
    diamondNode: Node = null
    @property({ type: Node })
    pointer: Node = null
    @property({ type: Node })
    layer: Node = null
    @property({ type: Node })
    dashedline: Node = null
    @property({ type: SpriteFrame })
    nftsprites: SpriteFrame[] = []
    @property({ type: Node })
    particlesytem: Node[] = []
    @property({ type: Node })
    nftnode: Node = null
    @property({ type: Node })
    bulbnode: Node = null

    wedgeanglearray = {}
    offsets = 0
    tween1: Tween<Node>;
    swingTween: Tween<Node>;
    i: number;
    dt;
    timetostop: number;
    upperlayer: Graphics;
    timeforpointer;
    dashedlines: Graphics;
    n = 20;
    intervals: number;
    start() {
        let g = this.wedgeNode.getComponent(Graphics)
        this.dashedlines = this.dashedline.getComponent(Graphics)
        this.upperlayer = this.layer.getComponent(Graphics)
        // this.layer.getComponent(UIOpacity).opacity = 0
        let color = [Color.GREEN, Color.BLUE, Color.WHITE, Color.CYAN, Color.GREEN, Color.MAGENTA, Color.RED, Color.WHITE, Color.YELLOW]
        let last = 0;
        let j = 0;
        for (let i = 0; i < 360; i++) {
            // console.log(i, i + 360 / n);
            last = i;
            this.createSector(g, 345, -last, new Color("red"), -(last + (360 / this.n)), color[j % color.length], Color.BLACK);
            this.createDashedArc(292, -0, -360);
            let wedge = instantiate(this.line)
            wedge.angle = -(i) - 90;
            let square = instantiate(this.square)
            square.angle = -last - ((360 / this.n) / 2) - 90;
            let diamonds = instantiate(this.diamond)
            let diamond = instantiate(this.diamond)
            let bulb = instantiate(this.bulb)
            let bulbs = instantiate(this.bulb)
            diamonds.angle = -i - 90
            bulbs.angle = (diamonds.angle + 90) * -1
            if (Math.ceil(diamonds.angle) % 90 == 0) {
                diamonds.angle = Math.ceil(diamonds.angle)
                bulbs.angle = (Math.ceil(diamonds.angle) + 90) * -1
                bulbs.children[0].setScale(1.4, 1.4, 1.4)
                diamonds.children[0].setScale(1.4, 1.4, 1.4)
            }
            this.diamondNode.addChild(diamonds)
            this.bulbnode.addChild(bulbs)
            diamond.angle = square.angle
            bulb.angle = (diamond.angle + 90) * -1
            if (Math.ceil(diamond.angle) % 90 == 0) {
                diamond.angle = Math.ceil(diamond.angle)
                bulb.angle = (Math.ceil(diamond.angle) + 90) * -1
                bulb.children[0].setScale(1.4, 1.4, 1.4)
                diamond.children[0].setScale(1.4, 1.4, 1.4)
            }
            this.diamondNode.addChild(diamond)
            this.bulbnode.addChild(bulb)

            // console.log(wedge.angle);
            i = last + (360 / this.n) - 1
            this.wedgeNode.getChildByName("lines").addChild(wedge)
            this.wedgeNode.getChildByName("square").addChild(square)
            this.wedgeanglearray[color[j % color.length].toString()] = (last + (360 / this.n))
            j++;
        }
        this.timeforpointer = 1 / (180 / (((((last + (360 / this.n))) - (last)))))
        // console.log(this.timeforpointer);
    }
    createDashedArc(radius, startAngle, endAngle) {
        // this.dashedlines.fillColor = Color.TRANSPARENT;
        this.dashedlines.strokeColor = new Color(0, 0, 0, 4)
        this.dashedlines.lineWidth = 2
        // console.log(startAngle);

        for (let i = -startAngle; i < -endAngle; i++) {
            // console.log("a");
            let startRad = (-i) * (Math.PI / 180);
            let endRad = -(i + 1) * (Math.PI / 180);

            this.dashedlines.arc(0, 0, radius, startRad, endRad, false)
            this.dashedlines.stroke();
            console.log(i, i + 5);

            i = i + 1
            // console.log("a", i);

            // i++;
        }
    }
    showNft() {

        TweenSystem.instance.ActionManager.removeAllActions();
        this.nftnode.getComponent(Sprite).spriteFrame = this.nftsprites[0];
        let nftnodetween = new Tween(this.nftnode);

        console.log("scale it");
        this.particlesytem[0].active = true
        this.particlesytem[1].active = true
        nftnodetween.by(1, { scale: new Vec3(1, 1, 1) }).call(() => { this.nftnode.children[0].getComponent(Animation).play("animation") }).start()
    }
    checker = 0;
    rotate() {
        //rotate wheel
        this.middleLightsAnimation()
        let maintween = new Tween(this.node)
        maintween.to(1, { position: new Vec3(0, -340, 0), scale: new Vec3(1.6, 1.6, 0) }).start()
        let tween = new Tween(this.wedgeNode)
        tween.by(8, { angle: (360 * 4 + this.wedgeanglearray[Color.WHITE.toString()] - this.offsets + Math.abs(90 - ((360 / this.n) / 2))) }, { easing: easing.fade }).call(() => {
            let lasttween = new Tween(this.pointer)
            lasttween
                .to(0, { angle: 0 }, { easing: easing.fade }).call(() => {
                    TweenSystem.instance.ActionManager.pauseAllRunningActions();
                }).start()
            this.showNft()




            this.endingLightsAnimation()
        }).start()
        this.offsets = this.wedgeanglearray[Color.WHITE.toString()] + Math.abs(90 - ((360 / this.n) / 2)) + 10
        //rotatepointer
        //starttween

        let starttween1 = new Tween(this.pointer)
        starttween1.to(0.25, { angle: -10 }, { easing: easing.sineIn })
        let starttween2 = new Tween(this.pointer)
        starttween2.to(0.25, { angle: 0 }, { easing: easing.sineOut })
        let sequnecetween1 = new Tween(this.pointer)
        //middletween
        let middletween1 = new Tween(this.pointer)
        middletween1.to(0.125, { angle: -30 }, { easing: easing.sineIn })
        let middletween2 = new Tween(this.pointer)
        middletween2.to(0.125, { angle: -60 }, { easing: easing.sineOut })
        let sequnecetween2 = new Tween(this.pointer)
        //endtween
        let endtween1 = new Tween(this.pointer)
        endtween1.to(0.2, { angle: -40 }, { easing: easing.sineIn })
        let endtween2 = new Tween(this.pointer)
        endtween2.to(0.2, { angle: -0 }, { easing: easing.sineOut })
        let sequnecetween3 = new Tween(this.pointer)
        sequnecetween1.sequence(starttween1, starttween2).call(() => {
            sequnecetween2.sequence(middletween1, middletween2).repeat(27).call(() => {
            }).call(() => {
                sequnecetween3.sequence(endtween1, endtween2).repeat(1).start()
            }).start()
        }).start()
        this.checker = 1;
        // console.log(TweenSystem.instance.ActionManager.getNumberOfRunningActionsInTarget(this.pointer));
    }
    endingLightsAnimation() {
        let iterationCount = 1;

        // Maximum number of iterations
        const maxIterations = 3;
        clearInterval(this.intervals)
        setInterval(() => {
            let time = 50;
            let i = (this.bulbnode.children.length / 4);
            while (i > 0) {
                this.endtimeout(i, time);
                time = time + 100
                i--;
            }
        }, 600)
    }
    endtimeout(i, time) {
        setTimeout(() => {
            this.changeLights(this.bulbnode.children[i]);
            this.changeLights(this.bulbnode.children[this.bulbnode.children.length - i]);


        }, time)
    }
    middleLightsAnimation() {
        let iterationCount = 1;

        // Maximum number of iterations
        const maxIterations = 3;

        let interval = 0;

        setTimeout(() => {
            interval = 2000;
            let time = 50;
            let i = 0;
            while (i < this.bulbnode.children.length) {
                this.middletimeout(i, time);
                time = time + 50
                i++;
            }
            this.intervals = setInterval(() => {
                let time = 50;
                let i = 0;

                while (i < this.bulbnode.children.length) {
                    this.middletimeout(i, time);
                    time = time + 50
                    i++;
                }
            }, interval)
        }, interval)
    }
    middletimeout(i, time) {
        setTimeout(() => {
            this.changeLights(this.bulbnode.children[i]);
            setTimeout(() => {
                this.changeLights(this.bulbnode.children[i]);
            }, 300)
            // this.changeLights(this.bulbnode.children[this.bulbnode.children.length - i]);


        }, time)
    }
    changeLights(node) {
        // if (node.active == true) {
        //     node.active = false;
        // }
        // else {
        //     node.active = true;
        //     
        // }
        node.active = !node.active
    }
    createSector(graphics, radius, startAngle, shadowColor, endAngle, fillColor, strokeColor) {
        const startRad = (startAngle) * (Math.PI / 180);
        const endRad = (endAngle) * (Math.PI / 180);
        const startRads = (startAngle) * (Math.PI / 180);
        const endRads = (endAngle) * (Math.PI / 180);
        // console.log(shadowColor);
        let shadowBlur = 2;
        const shadowOffsetX = Math.sin(startRad) * shadowBlur;
        const shadowOffsetY = -Math.cos(startRad) * shadowBlur;
        this.upperlayer.fillColor = Color.TRANSPARENT;
        this.upperlayer.lineWidth = 20;
        this.upperlayer.arc(0, 0, radius, startRads, endRads, false);
        this.upperlayer.stroke();
        this.upperlayer.fillColor = Color.TRANSPARENT;
        this.upperlayer.lineWidth = 20;
        this.upperlayer.arc(0, 0, radius - 240, startRads, endRads, false);
        this.upperlayer.stroke();
        this.upperlayer.fillColor = Color.TRANSPARENT;
        this.upperlayer.lineWidth = 20;
        this.upperlayer.stroke();
        graphics.fillColor = fillColor;
        graphics.strokeColor = strokeColor;
        graphics.moveTo(0, 0);
        graphics.arc(0, 0, radius, startRad, endRad, false);
        graphics.lineTo(0, 0);
        graphics.close();
        graphics.fill();
        graphics.stroke();
        // graphics.stroke();
    }
    update(deltaTime: number) {
        if (this.checker) {
            let pointerbox = this.pointer.getComponent(UITransform).getBoundingBoxToWorld();
            let boundingboxs = this.wedgeNode.getChildByName("lines").children[0].children[0].children[0].getPosition();
            boundingboxs = this.node.parent.getComponent(UITransform).convertToWorldSpaceAR(boundingboxs)
            console.log(((this.wedgeNode.angle * 180) / Math.PI) / 360);

            // if (Math.floor(this.wedgeNode.angle) / 360 == Math.floor(Math.floor(this.wedgeNode.angle) / 360)) {
            console.log(boundingboxs);

            let boundingbox = new Rect(boundingboxs.x, boundingboxs.y, 8, 356);
            if (boundingbox.intersects(pointerbox)) {
                console.log("pointer");
            }
            // console.log("pointers");
            // }
        }


        this.dt = deltaTime
    }
}

