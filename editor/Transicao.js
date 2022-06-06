const FRIENDLY_BLANK = "#";
const BLANK = "\u03B2";
const RIGHT = "R";
const LEFT = "L";

const FORMAT = (r, w, m) => `${r}|${w},${m}`;
const PARSE = /^\s*(?<read>.)\s*\|\s*(?<write>.)\s*,\s*(?<move>.)\s*$/;

class TransicaoDelta {
    constructor(read, write, move) {
        this.read = read;
        this.write = write;
        this.move = move;
    }

    static ofString(str) {
        const text = str
            .split(FRIENDLY_BLANK)
            .join(BLANK)
            .trim();
        const match = text.match(PARSE);
        if(!match) {
            throw new Error("As transições devem seguir o formato: #|#,R; A,B|L");
        }

        const {read, write, move} = match.groups;
        if(move !== RIGHT && move !== LEFT) {
            throw new Error("O movimento deve ser L ou R");
        }

        return new TransicaoDelta(read, write, move);
    }
}

class Transicao {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        
        this.deltas = [];
        this._textImage = null;
        this.text = '#|#,R';

        this.canvas = this.from.canvas;
        this.ctx = this.from.ctx;
        this.isActive = false;
        this.update();
    }

    set text(value) {
        this._updateDeltas(value);
        this._updateText();
    }
    get text() {
        return this.deltas
            .map(d => FORMAT(d.read, d.write, d.move))
            .join('; ');
    }

    update() {
        this.fromPos = this.from.pos.clone();
        this.toPos = this.to.pos.clone();
        let dif = this.toPos.clone().sub(this.fromPos).normalise().scale(ESTADO_RAIO + 5);
        this.fromPos.add(dif);
        this.toPos.add(dif.reverse());

        this.tipA = dif.clone().rotate(24 + 15).normalise().scale(15).add(this.toPos);
        this.tipB = dif.clone().rotate(24 - 15).normalise().scale(15).add(this.toPos);
        
        this.curve = this.fromPos.clone().add(this.toPos.clone().sub(this.fromPos).scale(0.5));
        this.curve.add(dif.rotate(90).normalise().scale(
            this.fromPos.clone().sub(this.toPos).mag * 0.25
        ));
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
        this.ctx.moveTo(this.fromPos.x, this.fromPos.y);
        this.ctx.quadraticCurveTo(this.curve.x, this.curve.y, this.toPos.x, this.toPos.y);
        this.ctx.lineTo(this.tipA.x,    this.tipA.y);
        this.ctx.moveTo(this.tipB.x,    this.tipB.y);
        this.ctx.lineTo(this.toPos.x,   this.toPos.y);
        this.ctx.stroke();

        // this.ctx.drawImage(this._textImage.image, (this.fromPos.x + this.toPos.x - this._textImage.width) / 2, (this.fromPos.y + this.toPos.y - this._textImage.height) / 2);
        this.ctx.drawImage(this._textImage.image, this.curve.x - this._textImage.width/2, this.curve.y - this._textImage.height/2);

        this.ctx.restore();
    }

    _updateText() {
        this._textImage = new Texto(this.text, ESTADO_RAIO, "#FE9");
    }

    _updateDeltas(str) {
        try {
            this.deltas = str
                .split(';')
                .map(TransicaoDelta.ofString);
        } catch(e) {
            alert(e.message);
        }
    }
}
