/*
 Copyright 2019 Joyce Emanuele, Wellington Cesar
 This file is part of AP.
 */

let alf = {};

class Autonomo {
	constructor(arq) {
		Object.assign(this, arq);
		this.estadoAtual = this.estadoInicial;
		this.raio = height / 2 - 100;
		this.fita = new Fita("Não iniciado");
		this.coor = {};
		let i = 0;
		for (let e of this.estados) {
			let x = this.raio * cos(map(i, 0, this.estados.length, 0, TAU)) + width / 2;
			let y = this.raio * sin(map(i, 0, this.estados.length, 0, TAU)) + height / 2 - 50;
			this.coor[e] = createVector(x, y);
			i++;
		}
	}

	reiniciar(cadeia) {
		this.estadoAtual = this.estadoInicial;
		this.fita.reiniciar(cadeia);
	}

	passo() {
		let letra = this.fita.letra();

		if (!this.alfabeto.includes(letra) && letra != ' ') {
			this.termino('s');
			return;
		}

		let r;
		if (this.delta[this.estadoAtual] && this.delta[this.estadoAtual][letra])
			r = this.delta[this.estadoAtual][letra];
		else {
			this.termino('r');
			this.estadoAtual = '';
			return;
		}
		this.estadoAtual = r.estado;
		this.fita.escrever(r.letra);
		if (r['direção'] === 'R') this.fita.R();
		else this.fita.L();

		if (this.estadosFinais.includes(this.estadoAtual))
			this.termino('a')
	}

	mostrar() {
		strokeWeight(1);
		noStroke();
		fill(0);
		textSize(35);
		if (estado === 'a') {
			background(20, 200, 95);
			text("   Aceito!\n   ( ͡ ͜ʖ ͡ )", width / 2 - 140, height / 2 - 50)
		} else if (estado === 'r') {
			background(170, 30, 80);
			text(" Rejeitado!\nヽ( ͡ಠ ʖ̯ ͡ಠ)ﾉ", width / 2 - 140, height / 2 - 50);
		} else if (estado === 's') {
			background(170, 30, 80);
			text("Símbolo não\nreconhecido!\n ┐( ͡° ʖ̯ ͡°)┌", width / 2 - 140, height / 2 - 50);
		}

		this.ligacoes();

		for (let i of this.estados) {
			fill(243, 255, 189);
			if (i === this.estadoAtual) fill(255, 22, 84);
			noStroke();

			circle(this.coor[i].x, this.coor[i].y, 30);

			fill(0);
			textSize(50);
			text(i, this.coor[i].x - 30, this.coor[i].y + 2);

			if (this.estadosFinais.includes(i)) {
				stroke(0);
				noFill();
				circle(this.coor[i].x, this.coor[i].y, 37);
			}
		}
		this.fita.mostrar()
	}

	termino(causa) {
		if (estado !== 'e') return;

		som.start();
		som.stop(0.5);

		som.freq(500);
		estado = causa;
	}
	ligacoes() {
		//Definição dos rótulos de transição
		for (let i of this.estados) {
			alf[i] = {};
			for (let j of this.estados) {
				alf[i][j] = [];
			}
		}
		for (let e of this.estados) {
			for (let l of this.alfabeto.concat([' '])) {
				if (this.delta[e] && this.delta[e][l]) {
					let origem, destino;
					if (l === ' ') origem = 'β';
					else origem = l;
					if(this.delta[e][l].letra === ' ') destino = 'β';
					else destino = this.delta[e][l].letra;
					alf[e][this.delta[e][l].estado].push("\n" + origem + "|" + destino + "," + this.delta[e][l]['direção']);
				}
			}
		}

		// Desenho da seta do estado inicial
		let EI = this.estadoInicial;
		stroke(0);
		line(this.coor[EI].x, this.coor[EI].y, this.coor[EI].x, this.coor[EI].y - 80);
		fill(color(100, 100, 100));
		noStroke();
		triangle(this.coor[EI].x, this.coor[EI].y - 28, this.coor[EI].x + 10, this.coor[EI].y - 50, this.coor[EI].x - 10, this.coor[EI].y - 50);

		textSize(25);
		fill(0);
		for (let i in alf) {
			for (let j in alf[i]) {
				if (alf[i][j].length === 0) continue;

				stroke(0);
				line(this.coor[i].x, this.coor[i].y, this.coor[j].x, this.coor[j].y);
				let pontoMedio = createVector((this.coor[i].x + this.coor[j].x) / 2, (this.coor[i].y + this.coor[j].y) / 2);

				noStroke();
				if (i === j) { //Memso estado
					triangle(this.coor[i].x, this.coor[i].y + 30, this.coor[i].x + 10, this.coor[i].y + 45, this.coor[i].x - 10, this.coor[i].y + 45);
					if (mouseX >= this.coor[i].x - 10 && mouseX <= this.coor[i].x + 10 && mouseY <= this.coor[i].y + 45 && mouseY >= this.coor[i].y + 30)
						text(alf[i][j], pontoMedio.x + 30, pontoMedio.y);
				} else { //Estados diferentes
					let pontotext = createVector((pontoMedio.x + this.coor[j].x) / 2, (pontoMedio.y + this.coor[j].y) / 2);
					push();
					let angulo = atan2(this.coor[i].y - this.coor[j].y, this.coor[i].x - this.coor[j].x);
					translate(pontotext.x, pontotext.y);
					rotate(angulo - HALF_PI);
					triangle(-5, 10, 5, 10, 0, -4);
					pop();
					if (mouseX >= pontotext.x - 10 && mouseX <= pontotext.x + 30 && mouseY >= pontotext.y - 20 && mouseY <= pontotext.y + 50)
						text(alf[i][j], pontotext.x, pontotext.y + 20);
				}
			}
		}
	}
}
