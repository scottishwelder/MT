/*
 Copyright 2019 Joyce Emanuele, Wellington Cesar
 This file is part of AP.
 */

let temp = [];

class Autonomo {
	constructor(arq) {
		Object.assign(this, arq);
		this.DI = [{"estado": this.estadoInicial, "pilha": this.pilhaInicial}];
	}

	reiniciar() {
		this.DI = [{"estado": this.estadoInicial, "pilha": this.pilhaInicial}];
	}

	passo(letra) {
		temp = [];

		if(true) {
			for(let p of this.DI) {
				let estadoAtual = p.estado;
				let topo = p.pilha.slice(0,1);
				for(let pp of this.delta[estadoAtual][letra][topo]) {
					let novoEstado = pp.estado;
					let novaPilha = pp.pilha + p.pilha.slice(1);
					temp.push({"estado": novoEstado, "pilha": novaPilha});
				}                                                                             
			}
			this.DI = temp;
		} else this.termino(false);
	}

	mostrar() {
		let x, y;

		temp = new Set(this.estadoAtual);
		strokeWeight(1);
		noStroke();
		fill(0);
		let dy = 35;
		for(let e of this.DI) {
			text(e.estado + ", " + e.pilha, 10, dy);
			dy += 50;
		}

		if(estado === 'a') {
			background(20, 200, 95);
			text("Aceito!\n( ͡ ͜ʖ ͡ )", width / 2 - 100, height / 2 - 50)
		} else if(estado === 'r') {
			background(170, 30, 80);
			text("Rejeitado!\nヽ( ͡ಠ ʖ̯ ͡ಠ)ﾉ", width / 2 - 150, height / 2 - 50);
		} else if(estado === 's') {
			background(170, 30, 80);
			text("Símbolo não\nreconhecido!\n┐( ͡° ʖ̯ ͡°)┌", width / 2 - 170, height / 2 - 50);
		}
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
		if(estado !== 'e') return;

		som.start();
		som.stop(0.5);

		if(fimcadeia && this.estadoAtual.filter(x => this.estadosFinais.has(x)).length > 0) {
			estado = 'a';
			som.freq(500);
		} else {
			som.freq(250);
			if(fimcadeia) estado = 'r';
			else estado = 's';
		}
	}
}
