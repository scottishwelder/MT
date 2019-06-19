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
		stroke(255);

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
		// line(width/2, 0, width / 2, height);
		// line(0, (height-100) / 2, width, (height-100) / 2);
		this.ligacoes();

		for (let i of this.estados) {
			fill(240, 80, 150);
			noStroke();

			circle(this.coor[i].x,this.coor[i]. y, 30);

			fill(0);
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
		if (this.estadosFinais.length) {
			for (let e of this.DI) {
				if (this.estadosFinais.includes(e.estado)) {
					estadoFinal = true;
					break;
				}
			}
		} else {
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
		stroke(0);

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
						alf[i][this.delta[i][j][k][m].estado].push("\n" + j + "," + k + "|" + this.delta[i][j][k][m].pilha);
					}
				}
			}
		}

		stroke(255);
		strokeWeight(2);
		push();
		textSize(20);
		for (let i in alf) {
			for (let j in alf[i]) {
				if (alf[i][j].length !== 0) {
					line(this.coor[i].x, this.coor[i].y, this.coor[j].x, this.coor[j].y);
					text(alf[i][j], (this.coor[i].x + this.coor[j].x) / 2, (this.coor[i].y + this.coor[j].y) / 2);
				}
			}
		}
		pop();
		/*
		for (i = 0; i < this.qtdEstados; i++) {
			for (j = 0; j < this.alfabeto.length; j++) {
				for (m = 0; m < this.delta[i][j].length; m++) {
					line(coor[i][k], coor[i][k + 1], coor[this.delta[i][j][m]][k], coor[this.delta[i][j][m]][k + 1]);

					if (i === this.delta[i][j][m]) {
						let PointM;
						push();
						if (coor[i][k + 1] < height / 2) {
							triangle(coor[i][k], coor[i][k + 1] - 25, coor[i][k] + 10, coor[i][k + 1] - 35, coor[i][k] - 10, coor[i][k + 1] - 35);
							PointM = createVector(((coor[i][k] + 10) + (coor[i][k] - 10)) / 2 + 15, ((coor[i][k + 1] - 35) + (coor[i][k + 1] - 35)) / 2);
						} else {
							triangle(coor[i][k], coor[i][k + 1] + 25, coor[i][k] + 10, coor[i][k + 1] + 35, coor[i][k] - 10, coor[i][k + 1] + 35);
							PointM = createVector(((coor[i][k] + 10) + (coor[i][k] - 10)) / 2, ((coor[i][k + 1] + 35) + (coor[i][k + 1] + 35)) / 2);
						}
						push();
						textSize(20);
						text(alf[i][this.delta[i][j][m]], PointM.x, PointM.y + 10);
						pop();
						pop();
					} else {
						push();
						var angulo = atan2(coor[i][k + 1] - coor[this.delta[i][j][m]][k + 1], coor[i][k] - coor[this.delta[i][j][m]][k]);
						let pM = createVector((coor[i][k] + coor[this.delta[i][j][m]][k]) / 2, (coor[i][k + 1] + coor[this.delta[i][j][m]][k + 1]) / 2);

						translate((pM.x + coor[this.delta[i][j][m]][k]) / 2, (pM.y + coor[this.delta[i][j][m]][k + 1]) / 2);
						rotate(angulo - HALF_PI);
						triangle(-10 * 0.5, 10, 10 * 0.5, 10, 0, -10 / 2);
						pop();

						push();
						textSize(20);
						text(alf[i][this.delta[i][j][m]], (pM.x + coor[this.delta[i][j][m]][k]) / 2, (pM.y + coor[this.delta[i][j][m]][k + 1]) / 2 + 20);
						pop();
					}
				}
			}
		}*/
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
