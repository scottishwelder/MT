/*
 Copyright 2019 Joyce Emanuele, Wellington Cesar
 This file is part of AP.
 */

let temp = [];
let alf = {};

class Autonomo {
	constructor(arq) {
		Object.assign(this, arq);
		this.DI = [];
		this.raio = height / 2 - 100;
		this.coor = {};
		let i = 0;
		for (let e of this.estados) {
			let x = this.raio * cos(map(i, 0, this.estados.length, 0, TAU)) + width / 2;
			let y = this.raio * sin(map(i, 0, this.estados.length, 0, TAU)) + height / 2 - 50;
			this.coor[e] = createVector(x, y);
			i++;
		}
	}

	reiniciar() {
		this.DI = [{ "estado": this.estadoInicial, "pilha": this.pilhaInicial }];
		this.Efecho();
	}

	passo(letra) {
		temp = [];

		if (this.alfabeto.includes(letra)) {
			for (let p of this.DI) {
				let estadoAtual = p.estado;
				let topo = p.pilha.slice(0, 1);
				if (topo === "") continue;
				for (let pp of this.delta[estadoAtual][letra][topo]) {
					let novoEstado = pp.estado;
					let novaPilha = pp.pilha + p.pilha.slice(1);
					temp.push({ "estado": novoEstado, "pilha": novaPilha });
				}
			}
			this.DI = temp;
			this.Efecho();
		} else this.termino(false);
	}

	mostrar() {
		strokeWeight(1);
		noStroke();
		fill(0);
		textSize(35);
		if (estado === 'f') {
			background(20, 200, 95);
			text(" Aceito por\nestado final!\n   ( ͡ ͜ʖ ͡ )", width / 2 - 200, height / 2 - 50)
		} else if (estado === 'v') {
			background(20, 200, 95);
			text(" Aceito por\npilha vazia!\n   ( ͡ ͜ʖ ͡ )", width / 2 - 180, height / 2 - 50)
		} else if (estado === 'r') {
			background(170, 30, 80);
			text("Rejeitado!\nヽ( ͡ಠ ʖ̯ ͡ಠ)ﾉ", width / 2 - 150, height / 2 - 50);
		} else if (estado === 's') {
			background(170, 30, 80);
			text("Símbolo não\nreconhecido!\n┐( ͡° ʖ̯ ͡°)┌", width / 2 - 170, height / 2 - 50);
		}
		let dy = 35;
		for (let e of this.DI) {
			text("(" + e.estado + ", " + e.pilha + ")", 10, dy);
			dy += 50;
		}

		this.ligacoes();

		for (let i of this.estados) {
			fill(243, 255, 189);
			for (let j of this.DI)
				if (i === j.estado) fill(255, 22, 84);
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
	}

	termino(fimcadeia) {
		window.navigator.vibrate(400);
		if (estado !== 'e') return;

		som.start();
		som.stop(0.5);

		let estadoFinal = false;
		let pilhaVazia = false;

		if (this.estadosFinais.length) {//Verificando se chegou em estado final
			for (let e of this.DI) {
				if (this.estadosFinais.includes(e.estado)) {
					estadoFinal = true;
					break;
				}
			}
		} else {//Verificando se esvaziou a pilha
			for (let e of this.DI) {
				if (e.pilha === "") {
					pilhaVazia = true;
					break;
				}
			}
		}
		if (fimcadeia && (estadoFinal || pilhaVazia)) {
			som.freq(500);
			if (estadoFinal) estado = 'f';
			else estado = 'v';
		} else {
			som.freq(250);
			if (fimcadeia) estado = 'r';
			else estado = 's';
		}
	}
	ligacoes() {
		for (let i of this.estados) {
			alf[i] = {};
			for (let j of this.estados) {
				alf[i][j] = [];
			}
		}
		for (let i of this.estados) {
			for (let j of this.alfabeto) {
				for (let k of this.empilhaveis) {
					for (let m = 0; m < this.delta[i][j][k].length; m++) {
						let pilhaApos = this.delta[i][j][k][m].pilha;
						if (pilhaApos == "") pilhaApos = "ε";
						alf[i][this.delta[i][j][k][m].estado].push("\n" + j + "," + k + "|" + pilhaApos);
					}
				}
			}
		}

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
				if (i === j) {//estados iguais
					triangle(this.coor[i].x, this.coor[i].y + 30, this.coor[i].x + 10, this.coor[i].y + 45, this.coor[i].x - 10, this.coor[i].y + 45);
					if (mouseX >= this.coor[i].x - 10 && mouseX <= this.coor[i].x + 10 && mouseY <= this.coor[i].y + 45 && mouseY >= this.coor[i].y + 30)
						text(alf[i][j], pontoMedio.x + 30, pontoMedio.y);
				} else {// estados diferentes
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
	Efecho() {
		let pertence = false;
		for (let i = 0; i < this.DI.length; i++) {
			let esAtual = this.DI[i].estado;
			let topo = this.DI[i].pilha.slice(0, 1);
			if (topo === "") continue;
			for (let j of this.delta[esAtual]["ε"][topo]) {
				let novapilha = j.pilha + this.DI[i].pilha.slice(1);
				for (let k = 0; k < this.DI.length; k++) {
					if (this.DI[k].pilha === novapilha && this.DI[k].estado === j.estado) { pertence = true; }
				}
				if (!pertence) this.DI.push({ "estado": j.estado, "pilha": novapilha });
			}
		}
	}
}
