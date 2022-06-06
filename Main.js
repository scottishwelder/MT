/*
 Copyright 2019 Joyce Emanuele, Wellington Cesar

 This file is part of AP.

 AP is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 AP is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with AP. If not, see <https://www.gnu.org/licenses/>.
 */

let aut, arquivo, som;
let botao, caixa, entrada;
// let estado = 'p'; //(p)arado, (e)xecutando, aceito por estado (f)inal, aceito por pilha (v)azia, (r)ejeitado e (s)ímbolo desconhecido
let estado = 'p'; //(p)arado, (e)xecutando, (a)ceito, (r)ejeitado e (s)ímbolo desconhecido

function preload() {
	//Arquivo de autômato disponível para edição em https://www.npoint.io/docs/31cf8809e118829df6d4
	arquivo = loadJSON("https://api.npoint.io/31cf8809e118829df6d4");
}

function setup() {
	createCanvas(windowWidth, windowHeight - 25)
		.mousePressed(passoManual);

	textFont("Roboto Mono");
	textAlign(LEFT, CENTER);

	//frameRate(2);//Letras por segundos
	aut = new Autonomo(arquivo);
	som = new p5.Oscillator();

	entrada = createInput()
		.class("um");
	botao = createButton("Iniciar")
		.mousePressed(iniciar)
		.class("dois");
	caixa = createCheckbox("Leitura automática")
		.class("tres");
}

function draw() {
	background(112, 193, 179);
	aut.mostrar();
	if (estado === 'e' && caixa.checked()) {
		aut.passo();
	}
}

function iniciar() {
	aut.reiniciar(entrada.value());
	estado = 'e';
}

function passoManual() {
	if (estado === 'e' && !caixa.checked()) {
		aut.passo();
	}
}
