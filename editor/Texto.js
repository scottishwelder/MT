class Texto {
    constructor(text, fontSize, color) {
        var canvas = document.createElement("canvas"),
               ctx = canvas.getContext("2d");

        ctx.font = `400 ${fontSize}px Arial`;
        this.width = ctx.measureText(text).width + 4;
        this.height = fontSize * 1.1;
        this.color = color || "#FFF";

        canvas.width  = this.width;
        canvas.height = this.height;

        ctx.font = `400 ${fontSize}px Arial`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.color;
        ctx.lineJoin = "round";
        ctx.fillText(text, 2, 0.55 * fontSize);

        // ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        // ctx.fillRect(0, 0, this.width, this.height);

        this.image = canvas;
    }
}
