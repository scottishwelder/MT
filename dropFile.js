function handleDropFile(event) {
    console.log('Abrindo arquivo...');

    event.preventDefault(); 

    if (!event.dataTransfer.items)
        return;

    console.log(event.dataTransfer.items);

    if (event.dataTransfer.items.length > 1) {
        alert('Por favor, insira apenas um arquivo por vez!');
        return;
    }

    if (event.dataTransfer.items[0].kind !== 'file') {
        alert('Por favor, insira um arquivo!');
        return;
    }

    const file = event.dataTransfer.items[0].getAsFile();
    console.log(file);

    readJsonFile(file);
}

function handleDragOver(event) {
    console.log('Prevenindo o comportamento default do browser...');

    event.preventDefault();
}

function readJsonFile(file) {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = event => {
        const MT = JSON.parse(event.target.result);
        console.log(MT);
	    aut = new Autonomo(MT);
    };
}
