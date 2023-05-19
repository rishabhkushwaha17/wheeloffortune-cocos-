import { _decorator, color, Color, Component, easing, Graphics, instantiate, Node, Prefab, Tween, TweenAction, TweenSystem, UIOpacity, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('WheelManager')
export class WheelManager extends Component {
    @property({ type: Prefab })
    line: Prefab = null
    @property({ type: Node })
    wedgeNode: Node = null
    @property({ type: Node })
    pointer: Node = null
    @property({ type: Node })
    layer: Node = null
    wedgeanglearray = {}
    offsets = 0
    tween1: Tween<Node>;
    swingTween: Tween<Node>;
    i: number;
    dt;
    timetostop: number;
    upperlayer: Graphics;
    timeforpointer;
    start() {
        let g = this.wedgeNode.getComponent(Graphics)
        this.upperlayer = this.layer.getComponent(Graphics)
        // this.layer.getComponent(UIOpacity).opacity = 0
        let n = 20;
        let color = [Color.GREEN, Color.BLUE, Color.CYAN, Color.GREEN, Color.MAGENTA, Color.RED, Color.WHITE, Color.YELLOW]
        let last = 0;
        let j = 0;
        for (let i = 0; i < 360; i++) {
            console.log(i, i + 360 / n);
            last = i;
            this.createSector(g, 340, -last, new Color("red"), -(last + (360 / n)), color[j % color.length], Color.BLACK);
            let wedge = instantiate(this.line)
            wedge.angle = -(i) - 90;
            console.log(wedge.angle);
            i = last + (360 / n) - 1
            this.wedgeNode.addChild(wedge)
            this.wedgeanglearray[color[j % color.length].toString()] = (last + (360 / n))
            j++;
        }
        this.timeforpointer = 1 / (180 / (((((last + (360 / n))) - (last)))))
        console.log(this.timeforpointer);
    }
    rotate() {
        //rotate wheel
        let tween = new Tween(this.wedgeNode)
        tween.by(8, { angle: (360 * 4 + this.wedgeanglearray[Color.WHITE.toString()] - this.offsets + 80) }, { easing: easing.fade }).call(() => {
            let lasttween = new Tween(this.pointer)
            lasttween
                .to(0, { angle: 0 }, { easing: easing.fade }).call(() => {
                    TweenSystem.instance.ActionManager.removeAllActions();
                }).start()
        }).start()
        this.offsets = this.wedgeanglearray[Color.WHITE.toString()] + 80
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
    }
    createSector(graphics, radius, startAngle, shadowColor, endAngle, fillColor, strokeColor) {
        const startRad = startAngle * (Math.PI / 180);
        const endRad = endAngle * (Math.PI / 180);
        console.log(shadowColor);
        let shadowBlur = 2;
        const shadowOffsetX = Math.sin(startRad) * shadowBlur;
        const shadowOffsetY = -Math.cos(startRad) * shadowBlur;

        // Draw the shadow shape

        graphics.fillColor = fillColor;
        graphics.strokeColor = strokeColor;
        graphics.moveTo(0, 0);
        graphics.arc(0, 0, radius, startRad, endRad, false);
        graphics.lineTo(0, 0);
        graphics.close();
        graphics.fill();
        graphics.stroke();
        this.upperlayer.moveTo(0, 0);
        this.upperlayer.arc(0, 0, radius + shadowBlur, startRad, endRad, false);
        this.upperlayer.lineTo(0, 0);
        this.upperlayer.close();
        let color = new Color(0, 0, 0, 20)
        this.upperlayer.fillColor = color; // Semi-transparent black
        console.log(this.upperlayer.fillColor);

        this.upperlayer.fill();
        this.upperlayer.stroke();
        // graphics.stroke();
    }
    update(deltaTime: number) {
        this.dt = deltaTime
    }
}

