/*
 Copyright 2019 Joyce Emanuele, Wellington Cesar
 This file is part of AP.
 */

let temp = [];

class Autonomo {
	constructor(arq) {
		Object.assign(this, arq);
		this.DI = [{ "estado": this.estadoInicial, "pilha": this.pilhaInicial }];
		this.DI = Efecho(this.delta, this.DI);
	}

	reiniciar() {
		this.DI = [{ "estado": this.estadoInicial, "pilha": this.pilhaInicial }];
		this.DI = Efecho(this.delta, this.DI);
	}

	passo(letra) {
		temp = [];

		if (this.alfabeto.includes(letra)) {
			for (let p of this.DI) {
				let estadoAtual = p.estado;
				let topo = p.pilha.slice(0, 1);
				for (let pp of this.delta[estadoAtual][letra][topo]) {
					let novoEstado = pp.estado;
					let novaPilha = pp.pilha + p.pilha.slice(1);
					temp.push({ "estado": novoEstado, "pilha": novaPilha });
				}
			}
			this.DI = temp;
			this.DI = Efecho(this.delta, this.DI);
		} else this.termino(false);
	}

	mostrar() {
		let x, y;

		temp = new Set(this.estadoAtual);
		strokeWeight(1);
		noStroke();
		fill(0);
		let dy = 35;
		for (let e of this.DI) {
			text(e.estado + ", " + e.pilha, 10, dy);
			dy += 50;
		}
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
		// line(width/2, 0, width / 2, height);
		// line(0, (height-100) / 2, width, (height-100) / 2);
		//this.ligacoes();

		/*for(let i = 0; i < this.qtdEstados; i++) {
			x = this.raio * cos(map(i, 0, this.qtdEstados, 0, TAU)) + width / 2;
			y = this.raio * sin(map(i, 0, this.qtdEstados, 0, TAU)) + height / 2 - 50;

			if(temp.has(i)) fill(255, 22, 84);
			else fill(243, 255, 189);
			noStroke();

			circle(x, y, 25);

			fill(0);
			text(i, x - 15, y + 2);

			if(this.estadosFinais.has(i)) {
				stroke(0);
				noFill();
				circle(x, y, 30);
			}
		}*/
	}

	termino(fimcadeia) {
		window.navigator.vibrate(400);
		if (estado !== 'e') return;

		som.start();
		som.stop(0.5);

		let estadoFinal = false;
		let pilhaVazia = false;
		if (this.estadosFinais.lenght) {
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
}

function Efecho(delta, DIs) {
	let pertence = false;
	for (let i = 0; i < DIs.length; i++) {
		let esAtual = DIs[i].estado;
		let topo = DIs[i].pilha.slice(0, 1);
		for (let j of delta[esAtual]["ε"][topo]) {
			let novapilha = j.pilha + DIs[i].pilha.slice(1);
			for (let k = 0; k < DIs.length; k++) {
				if (DIs[k].pilha === novapilha && DIs[k].estado === j.estado) { pertence = true; }
			}
			if (!pertence) DIs.push({ "estado": j.estado, "pilha": novapilha });
		}
	}
	return DIs;
}
