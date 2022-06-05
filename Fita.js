/*
 Copyright 2019 Joyce Emanuele, Wellington Cesar
 This file is part of AP.
 */

let larg = 30.005;

class Fita { //TODO Símbolos brancos
	constructor(c) {
		if (c === '') this.cadeia = ' ';
		else this.cadeia = c;
		this.atual = 0;
	}

	reiniciar(c) {
		if (c === '') this.cadeia = ' ';
		else this.cadeia = c;
		this.atual = 0;
	}

	mostrar() {
		noStroke();
		fill(36, 123, 160);
		rect(0, height - 100, width, 100);
		fill(0);
		textSize(50);
		text(this.cadeia, width / 2 - larg * this.atual - larg * 0.59, height - 50);
		strokeWeight(3);
		stroke(255, 22, 84);
		line(width / 2 - larg / 2 - 3, height - 100, width / 2 - larg / 2 - 3, height);
		line(width / 2 + larg / 2 - 3, height - 100, width / 2 + larg / 2 - 3, height);
	}

	R() {
		this.atual++;
		if (this.atual === this.cadeia.length)
			this.escrever(' ')
	}

	L() {
		if (this.atual === 0) {
			this.atual--;
			this.escrever(' ');
			this.atual++;
			return;
		}
		this.atual--;
	}

	letra() {
		//let l = this.cadeia.charAt(this.atual);
		//if (!l) return "β";
		//return l
		return this.cadeia.charAt(this.atual);
	}

	escrever(letra) {
		this.cadeia = this.cadeia.substring(0, this.atual) + letra + this.cadeia.substring(this.atual + 1);
	}
}