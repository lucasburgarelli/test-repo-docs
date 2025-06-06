document.querySelectorAll('nav.sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const docFile = link.getAttribute('data-doc');
        loadDoc(docFile);
    });
});

function loadDoc(filename) {
    fetch(`content/${filename}`)
        .then(response => response.text())
        .then(text => {
            const html = parseMyDoc(text);
            document.getElementById('content').innerHTML = html;
        });
}

function parseMyDoc(text) {
    // Linguagem simplificada:
    // # Título
    // ## Subtítulo
    // ![alt](caminho)
    // texto normal
    // - lista

    let html = text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%;"/>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n<li>/g, '<ul><li>').replace(/<\/li>\n(?!<li>)/g, '</li></ul>')
        .replace(/\n/g, '<br>');

    return html;
}
