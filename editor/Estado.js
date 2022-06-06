const ESTADO_RAIO = 25;

class Estado {
    constructor(position, name, canvas) {
        this.pos = position.clone();
        this._name = name;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this._text = new Texto(this._name, ESTADO_RAIO);
        this.isActive = false;
        this.isHovered = true;
        this.isInicial = false;
        this.isFinal = false;
        this._speed = 1;
        this._antiSpeed = 0;
    }

    get name() { return this._name; }
    set name(name) {
        this._name = name;
        this._text = new Texto(this._name, ESTADO_RAIO);
    }

    get speed() { return this._speed; }
    get antiSpeed() { return this._antiSpeed; }
    set speed(speed) {
        this._speed = speed;
        this._antiSpeed =  1 - speed;
    }

    move(pos) {
        this.pos.clone()
                .scale(this.antiSpeed)
                .add(pos.clone().scale(this.speed))
                .copyTo(this.pos);

        return this;
    }

    desenha() {
        this.ctx.save();

        this.ctx.strokeStyle = "#FFF";
        this.ctx.fillStyle = "transparent";
        if(this.isHovered)
            this.ctx.strokeStyle = this.ctx.fillStyle = "#5E9";
        if(this.isActive)
            this.ctx.strokeStyle = this.ctx.fillStyle = "#FFA34E";

        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, ESTADO_RAIO, 0, Math.TAU);
        this.ctx.stroke();

        this.ctx.drawImage(this._text.image, this.pos.x - this._text.width / 2, this.pos.y - this._text.height / 2);

        this.ctx.globalAlpha = 0.2;
        this.ctx.fill();

        this.ctx.globalAlpha = 1;
        if(this.isFinal) {
            this.ctx.beginPath();
            this.ctx.arc(this.pos.x, this.pos.y, ESTADO_RAIO + 5, 0, Math.TAU);
            this.ctx.stroke();
        }

        if(this.isInicial) {
            this.ctx.lineCap = this.ctx.lineJoin = "round";
            this.ctx.beginPath();
            this.ctx.moveTo(this.pos.x - 60 - ESTADO_RAIO, this.pos.y);
            this.ctx.lineTo(this.pos.x - 10 - ESTADO_RAIO,  this.pos.y);
            this.ctx.moveTo(this.pos.x - 10 - 10 - ESTADO_RAIO,  this.pos.y + 5);
            this.ctx.lineTo(this.pos.x - 10 - ESTADO_RAIO,  this.pos.y);
            this.ctx.lineTo(this.pos.x - 10 - 10 - ESTADO_RAIO,  this.pos.y - 5);
            this.ctx.stroke();
        }

        this.ctx.restore();
        return this;
    }
}
