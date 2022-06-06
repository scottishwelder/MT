class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    copyTo(vec) {
        vec.x = this.x;
        vec.y = this.y;

        return this;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;

        return this;
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;

        return this;
    }

    scale(factor) {
        this.x *= factor;
        this.y *= factor;

        return this;
    }

    reverse() {
        return this.scale(-1);
    }

    get magSq() {
        return this.x * this.x + this.y * this.y;
    }

    get mag() {
        return Math.sqrt(this.magSq);
    }

    normalise() {
        let mag = this.mag;

        this.x /= mag;
        this.y /= mag;

        return this;
    }

    rotate(angle) {
        let cosRY = Math.cos(angle * Math.PI / 180),
            sinRY = Math.sin(angle * Math.PI / 180),
            temp  = this.clone();
    
        this.x = (temp.x * cosRY) - (temp.y * sinRY);
        this.y = (temp.x * sinRY) + (temp.y * cosRY);
    
        return this;
    }
}
