const menuStructure = [
    { title: "Introdução", file: "intro.mydoc" },
    { title: "API", children: [
        { title: "Visão Geral", file: "api.mydoc" },
        { title: "Component A", file: "api_componentA.mydoc" },
        { title: "Component B", file: "api_componentB.mydoc" }
    ]},
    { title: "Tutoriais", children: [
        { title: "Visão Geral", file: "tutorials_overview.mydoc" },
        { title: "Avançado", file: "tutorials_advanced.mydoc" }
    ]}
];
function buildSidebarMenu(menu, parent) {
    menu.forEach(item => {
        const li = document.createElement("li");
        if (item.file) {
            li.textContent = item.title;
            li.addEventListener("click", () => {
                loadDoc(item.file);
                setActive(li);
            });
        } else {
            li.textContent = item.title;
            const subUl = document.createElement("ul");
            buildSidebarMenu(item.children, subUl);
            li.appendChild(subUl);
        }
        parent.appendChild(li);
    });
}
function setActive(selectedLi) {
    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    selectedLi.classList.add("active");
}
document.addEventListener("DOMContentLoaded", () => {
    const sidebarMenu = document.getElementById("sidebar-menu");
    buildSidebarMenu(menuStructure, sidebarMenu);
});
function loadDoc(filename) {
    fetch(`content/${filename}`)
        .then(response => {
            if (!response.ok) throw new Error(`Erro carregando ${filename}`);
            return response.text();
        })
        .then(text => {
            const html = parseMyDoc(text);
            document.getElementById("content").innerHTML = html;
        })
        .catch(err => {
            document.getElementById("content").innerHTML = `<p style="color:red;">Erro carregando arquivo.</p>`;
            console.error(err);
        });
}
function parseMyDoc(text) {
    return text
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%;"/>')
        .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        .replace(/\n<li>/g, "<ul><li>").replace(/<\/li>\n(?!<li>)/g, "</li></ul>")
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");
}