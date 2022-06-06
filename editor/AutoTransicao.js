class AutoTransicao extends Transicao {
    constructor(from) {
        super(from, from);
    }

    update() {
        this.drawPos = new Array();
        let pos = this.from.pos.clone();
        pos.x -= ESTADO_RAIO / 2;
        pos.y -= ESTADO_RAIO + 5;
        this.drawPos.push(pos);

        pos = this.from.pos.clone();
        pos.x -= ESTADO_RAIO * 2;
        pos.y -= ESTADO_RAIO * 3;
        this.drawPos.push(pos);

        pos = this.from.pos.clone();
        pos.x += ESTADO_RAIO * 2;
        pos.y -= ESTADO_RAIO * 3;
        this.drawPos.push(pos);

        pos = this.from.pos.clone();
        pos.x += ESTADO_RAIO / 2;
        pos.y -= ESTADO_RAIO + 5;
        this.drawPos.push(pos);

        this.tipA = new Vector2(1, -5).rotate(20 + 15).normalise().scale(15).add(this.drawPos[3]);
        this.tipB = new Vector2(1, -5).rotate(20 - 15).normalise().scale(15).add(this.drawPos[3]);
    }

    desenha() {
        this.ctx.save();

        this.ctx.strokeStyle = "#FFF";
        if(this.isActive)
            this.ctx.strokeStyle = "#FFA34E";
        this.ctx.lineWidth = 2;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(this.drawPos[0].x, this.drawPos[0].y);
        this.ctx.bezierCurveTo(this.drawPos[1].x, this.drawPos[1].y, this.drawPos[2].x, this.drawPos[2].y, this.drawPos[3].x, this.drawPos[3].y);
        this.ctx.lineTo(this.tipA.x,       this.tipA.y);
        this.ctx.moveTo(this.tipB.x,       this.tipB.y);
        this.ctx.lineTo(this.drawPos[3].x, this.drawPos[3].y);
        this.ctx.stroke();

        this.ctx.drawImage(this._textImage.image, this.from.pos.x - this._textImage.width / 2, this.from.pos.y - ESTADO_RAIO * 4);

        this.ctx.restore();
        return this;
    }
}
