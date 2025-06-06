const menuStructure = [
    { title: "Introdução", file: "intro.mydoc" },
    { title: "API", children: [
        { title: "Visão Geral", file: "api.mydoc" },
        { title: "Component A", file: "api_componentA.mydoc" },
        { title: "Component B", file: "api_componentB.mydoc" },
        { title: "Component C", children: [
            { title: "Subcomponent C1", file: "componentC1.mydoc" },
            { title: "Subcomponent C2", children: [
                { title: "SubSubcomponent C2.1", file: "componentC2_1.mydoc" },
                { title: "SubSubcomponent C2.2", file: "componentC2_2.mydoc" },
                { title: "SubSubcomponent C2.3", children: [
                    { title: "C2.3.1", file: "componentC2_3_1.mydoc" },
                    { title: "C2.3.2", file: "componentC2_3_2.mydoc" },
                    { title: "C2.3.3", file: "componentC2_3_3.mydoc" }
                ]}
            ]}
        ]}
    ]},
    { title: "Tutoriais", children: [
        { title: "Visão Geral", file: "tutorials_overview.mydoc" },
        { title: "Avançado", file: "tutorials_advanced.mydoc" },
        { title: "Avançado 2", file: "tutorials_advanced2.mydoc" }
    ]}
];
function buildSidebarMenu(menu, parent) {
    menu.forEach(item => {
        const li = document.createElement("li");
        if (item.file) {
            li.textContent = item.title;
            li.addEventListener("click", (e) => {
                e.stopPropagation();
                loadDoc(item.file);
                setActive(li);
            });
        } else {
            li.textContent = item.title;
            li.addEventListener("click", (e) => {
                e.stopPropagation();
                li.classList.toggle("expanded");
            });
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
            Prism.highlightAll();
        })
        .catch(err => {
            document.getElementById("content").innerHTML = `<p style="color:red;">Erro carregando arquivo.</p>`;
            console.error(err);
        });
}
function parseMyDoc(text) {
    text = text.replace(/```(.*?)\n([\s\S]*?)```/gim, (match, lang, code) =>
        `<pre><code class="language-${lang.trim()}">${escapeHtml(code)}</code></pre>`
    );
    text = text.replace(/(^\|.*\|$)/gim, row => {
        const cells = row.split("|").filter(cell => cell.trim() !== "");
        if (cells.length > 1) {
            const rowHtml = cells.map(cell => `<td>${cell.trim()}</td>`).join("");
            return `<tr>${rowHtml}</tr>`;
        }
        return row;
    }).replace(/<tr>(.*?)<\/tr>/gim, (match, inner) => `<table><tbody>${match}</tbody></table>`);
    return text
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1"/>')
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        .replace(/\n<li>/g, "<ul><li>").replace(/<\/li>\n(?!<li>)/g, "</li></ul>")
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");
}
function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[m]));
}
