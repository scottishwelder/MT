const CLICK_WAIT = 200;
const GRID = 100;
(() => {
    let canvas = document.getElementById("quadro"),
           ctx = canvas.getContext("2d");

    let acoes = document.getElementById("acoes"),
         ctx2 = acoes.getContext("2d");

    const estados  = new Array(),
       transicoes  = new Array(),
            mouse  = new Vector2();
    mouse.hasMoved = false;

    var novoEstado = null,
       selecionado = null,
        clickStart = null,
       multiSelect = null;

    function frame() {
        ctx.fillStyle = "#030303";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, acoes.width, acoes.height);

        estados.forEach(e => e.desenha());
        transicoes.forEach(t => t.desenha());

        if(novoEstado)
            novoEstado.move(mouse).desenha();

        if(clickStart && (new Date()).getTime() - clickStart.time.getTime() > CLICK_WAIT) {
            ctx2.save();

            ctx2.fillStyle = "#09F";
            ctx2.strokeStyle = "#09F";

            ctx2.strokeRect(clickStart.x, clickStart.y, mouse.x - clickStart.x, mouse.y - clickStart.y);
            ctx2.globalAlpha = 0.1;
            ctx2.fillRect(clickStart.x, clickStart.y, mouse.x - clickStart.x, mouse.y - clickStart.y);

            ctx2.restore();
        }

        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;

        mouse.hasMoved = true;
    });

    // Selecionar
    window.addEventListener("click", e => {
        if(novoEstado || estados.length == 0 || (clickStart && (new Date()).getTime() - clickStart.time.getTime() > CLICK_WAIT))
            return;

        let closest = estados.reduce((a, e) => a.pos.clone().sub(mouse).magSq > e.pos.clone().sub(mouse).magSq ? e : a);
        if(closest.pos.clone().sub(mouse).magSq > ESTADO_RAIO * ESTADO_RAIO)
            return;

        if(!selecionado || selecionado instanceof Transicao || selecionado instanceof AutoTransicao) {
            desselecionar();
            selecionado = closest;
            selecionado.isActive = true;
            mostraIntrucao("selecionado");
        }else{
            estados.forEach(e => e.isActive = false);
            transicoes.forEach(t => t.isActive = false);
            multiSelect = null;
            selecionado.isActive = false;
            if(selecionado == closest)
                selecionado = transicoes.find(t => t.from == selecionado && t.to == selecionado) ||
                        new AutoTransicao(selecionado, "#");
            else
                selecionado = transicoes.find(t => t.from == selecionado && t.to == closest) ||
                        new Transicao(selecionado, closest, "#");
            selecionado.isActive = true;
            
            if(!transicoes.includes(selecionado))
                transicoes.push(selecionado);
            mostraIntrucao("selecionada");
        }
    });

    // Click novo estado
    window.addEventListener("click", e => {
        if(!novoEstado) return;

        estados.push(new Estado(mouse, "q" + estados.length, canvas));
        if(estados.length == 1)
            estados[0].isInicial = true;
        novoEstado = null;
        mostraIntrucao("geral");
    });

    // Ações para selecionados
    window.addEventListener("keydown", e => {
        switch(e.key.toLowerCase()) {
            case "escape":
                desselecionar();
                mostraIntrucao("geral");
            break;

            case "backspace":
            case "delete":
                novoEstado = null;
                if(selecionado) {
                    if(selecionado instanceof Estado) {
                        for(let i = transicoes.length - 1; i >= 0; i--){
                            let t = transicoes[i];

                            if(t.from == selecionado || t.to == selecionado)
                                transicoes.splice(transicoes.indexOf(t), 1);
                        }
                        estados.splice(estados.indexOf(selecionado), 1);
                    }
                    if(selecionado instanceof Transicao || selecionado instanceof AutoTransicao)
                        transicoes.splice(transicoes.indexOf(selecionado), 1);
                    selecionado = null;
                    mostraIntrucao("geral");
                }
                if(multiSelect) {
                    multiSelect.forEach(e => {
                        for(let i = transicoes.length - 1; i >= 0; i--){
                            let t = transicoes[i];

                            if(t.from == e || t.to == e)
                                transicoes.splice(transicoes.indexOf(t), 1);
                        }
                        estados.splice(estados.indexOf(e), 1);
                    });
                    mostraIntrucao("geral");
                }
            break;

            case "t":
                if(!(selecionado && selecionado instanceof Estado))
                    break;
                mouse.copyTo(selecionado.pos);
                transicoes.filter(t => t.from == selecionado || t.to == selecionado)
                        .forEach(t => t.update());
                desselecionar();
                mostraIntrucao("geral");
            break;

            case "f2":
                if(!selecionado)
                    break;
                if(selecionado instanceof Estado) {
                    let novoNome = prompt("Novo nome do estado selecionado:", selecionado.name);
                    if(novoNome)
                        selecionado.name = novoNome;
                    desselecionar();
                    mostraIntrucao("geral");
                }
                if(selecionado instanceof Transicao || selecionado instanceof AutoTransicao) {
                    let novoNome = prompt("Novo nome da transicao selecionado:", selecionado.text);
                    if(novoNome)
                        selecionado.text = novoNome;
                    desselecionar();
                    mostraIntrucao("geral");
                }

            break;

            case "i":
                var atr = "isInicial";
            case "f":
                var atr = atr || "isFinal";
                if(!(selecionado && selecionado instanceof Estado))
                    break;
                selecionado[atr] = !selecionado[atr];
                desselecionar();
                mostraIntrucao("geral");
            break;

            case "o":
                if(!multiSelect)
                    break;
                multiSelect.forEach(e => {
                    e.pos.x = Math.round(e.pos.x/GRID) * GRID;
                    e.pos.y = Math.round(e.pos.y/GRID) * GRID;
                });

                transicoes.forEach(t => t.update());
                desselecionar();
                mostraIntrucao("geral");
            break;
        }
    });

    // Multi seleção
    window.addEventListener("mousedown", e => {
        if(novoEstado)
            return;

        clickStart = mouse.clone();
        clickStart.time = new Date();
        clickStart.selected = new Array();
    });
    window.addEventListener("click", e => {
        if(!clickStart)
            return;
        multiSelect = clickStart.selected;
        clickStart = null;

        if(multiSelect.length) {
            estados.forEach(e => e.isActive = false);
            transicoes.forEach(t => t.isActive = false);
        }
        if(selecionado && multiSelect.length) {
            selecionado.isActive = false;
            selecionado = null;
            mostraIntrucao("geral");
        }

        multiSelect.forEach(e => {
            e.isActive = true;
            transicoes.forEach(t => {
                if(t.to == e || t.from == e)
                    t.isActive = true;
            });
        });

        if(multiSelect.length == 1) {
            selecionado = multiSelect[0];
            mostraIntrucao("selecionado");
        }
        if(multiSelect.length <= 1)
            multiSelect = null;
        else
            mostraIntrucao("multi");
    });

    // Função para adicionar estados
    window.addEstado = function() {
        desselecionar();
        novoEstado = new Estado(mouse, "", acoes);
        novoEstado.isActive = true;
        window.novoEstado = novoEstado;
        mostraIntrucao("novo");
    };

    // Função para desselecionar tudo

    window.desselecionar = function() {
        estados.forEach(e => e.isActive = false);
        transicoes.forEach(t => t.isActive = false);
        multiSelect = null;
        selecionado = null;
        novoEstado  = null;
    };

    // Instruções
    window.mostraIntrucao = function(nome) {
        document.querySelectorAll(".instrucoes").forEach(i => i.classList.remove("instrucoes_visivel"));
        document.querySelector(`.instrucoes[data-para="${nome}"]`).classList.add("instrucoes_visivel");
    };

    // Atalhos
    window.addEventListener("keydown", e => {
        switch(e.key.toLowerCase()) {
            case "n":
                addEstado();
            break;

            case "c":
                if(estados.length == 0)
                    break;

                let minPos = estados[0].pos.clone(),
                    maxPos = estados[0].pos.clone();

                estados.forEach(e => {
                    if(e.pos.x < minPos.x)
                        minPos.x = e.pos.x;
                    if(e.pos.x > maxPos.x)
                        maxPos.x = e.pos.x;
                    if(e.pos.y < minPos.y)
                        minPos.y = e.pos.y;
                    if(e.pos.y > maxPos.y)
                        maxPos.y = e.pos.y;
                });

                let delta = new Vector2(canvas.width, canvas.height)
                        .sub(maxPos)
                        .sub(minPos)
                        .scale(0.5);

                estados.forEach(e => e.pos.add(delta));
                transicoes.forEach(t => t.update());
            break;

            case "i":
                if(!e.ctrlKey)
                    return;
                if(estados.length > 0)
                    return alert("Delete a MT atual antes de importar outra (Ctrl+A Del)");

                // Lendo automato
                var automato = prompt("Cole o conteudo do arquivo:");
                if(!automato)
                    return alert("Operação cancelada");
                try {
                    automato = JSON.parse(automato);
                } catch(e) {
                    return alert("Arquivo inválido");
                }

                // Verificar se automato contem
                if(!automato.posicoes)
                    return alert("MT sem posições definidas!");
                try { automato.posicoes = atob(automato.posicoes); } catch(_e) { }
                automato.posicoes = automato.posicoes.split(":");
                automato.posicoes = automato.posicoes.map(p => parseInt(p, 36));

                // Colocando estados
                automato.estados.forEach((e, i) => {
                    estados.push(new Estado(new Vector2(automato.posicoes[2*i], automato.posicoes[2*i+1]), e, canvas));
                });

                // Colocando transicoes
                automato.transicoes.forEach(t => {
                    let from = estados.find(e => e.name == t[0]),
                          to = estados.find(e => e.name == t[2]);

                    
                    let transicao = new Transicao(from, to);
                    if(from == to)
                        transicao = new AutoTransicao(from);

                    transicao.using = t[1];

                    transicoes.push(transicao);
                });

                // Setando inicial
                estados.find(e => e.name == automato.inicial).isInicial = true;

                // Setando final
                estados.filter(e => automato.finais.includes(e.name)).forEach(e => e.isFinal = true);
            break;

            case "a":
                if(estados.length == 0 || !e.ctrlKey)
                    return;

                multiSelect = [...estados];
                selecionado = null;
                clickStart = null;
                estados.forEach(e => e.isActive = true);
                transicoes.forEach(t => t.isActive = true);
                mostraIntrucao("multi");
            break;

            case "s":
                if(!e.ctrlKey)
                    break;
                e.preventDefault();
                
                var automato = new Object();
                // alfabeto
                automato.alfabeto = transicoes
                    .flatMap(t => t.deltas)
                    .flatMap(t => [t.read, t.write]);
                automato.alfabeto = new Set(automato.alfabeto);
                automato.alfabeto = [...automato.alfabeto].filter(v => v !== '\u03B2');
                automato.alfabeto.sort();

                // estados
                automato.estados = estados.map(e => e.name);
                automato.estados.sort();

                // inicial
                automato.inicial = estados.filter(e => e.isInicial);
                if(automato.inicial.length != 1){
                    alert(`Encontrados ${automato.inicial} iniciais, necessário: 1`);
                    break;
                }
                automato.inicial = automato.inicial[0].name;

                // finais
                automato.finais = estados.filter(e => e.isFinal).map(a => a.name);

                // transicoes
                automato.delta = {};
                for(const t of transicoes) {
                    for(const d of t.deltas) {
                        automato.delta[t.from.name] = automato.delta[t.from.name] || {};
                        automato.delta[t.from.name][d.read] = {
                            letra: d.write,
                            estado: t.to.name,
                            direcao: d.move,
                        };
                    }
                }

                // posicoes
                let pos = new Array();
                estados.forEach(e => {
                    pos.push(e.pos.x);
                    pos.push(e.pos.y);
                });
                automato.posicoes = pos.map(p => p.toString(36)).join(":");
                automato.posicoes = btoa(automato.posicoes);

                automato = JSON.stringify(automato, null, 3);
                
                let link = document.createElement("a");
                link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(automato));
                link.setAttribute("download", (prompt("Qual o nome da MT?") || "turing") + ".json");

                link.style.display = "none";
                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
            break;
        }
    });

    // Efeito de hover
    setInterval(() => {
        if(!mouse.hasMoved)
            return;
        if(estados.length == 0)
            return;
        mouse.hasMoved = false;

        estados.forEach(e => e.isHovered = false);

        if(clickStart && (new Date()).getTime() - clickStart.time.getTime() > CLICK_WAIT) {
            clickStart.selected.length = 0;
            estados.forEach(e => {
                if(((e.pos.x > clickStart.x && e.pos.x < mouse.x) || (e.pos.x < clickStart.x && e.pos.x > mouse.x)) &&
                        ((e.pos.y > clickStart.y && e.pos.y < mouse.y) || (e.pos.y < clickStart.y && e.pos.y > mouse.y)))
                    clickStart.selected.push(e);
            });

            clickStart.selected.forEach(s => s.isHovered = true);
        }else {
            let closest = estados.reduce((a, e) => a.pos.clone().sub(mouse).magSq > e.pos.clone().sub(mouse).magSq ? e : a);
            if(closest.pos.clone().sub(mouse).magSq > ESTADO_RAIO * ESTADO_RAIO)
                return;
            closest.isHovered = true;
        }
    }, 80);

    // Tamanho dos canvas
    function atualizaTamanho() {
        canvas.width  = acoes.width  = window.innerWidth;
        canvas.height = acoes.height = window.innerHeight;
    }
    atualizaTamanho();
    window.addEventListener("resize", atualizaTamanho);
})();
