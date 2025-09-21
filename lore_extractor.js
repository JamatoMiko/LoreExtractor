class LoreExtractor
{
    constructor()
    {

    }

    Extractor(dataText)
    {
        const keywords = document.getElementById("keywords").value.split(",").map(k => k.trim().toLowerCase()).filter(k => k.length > 0);//キーワードをコンマごとに分割
        const colors = [
            "#e6194b",
            "#3cb44b",
            "#ffe119",
            "#4363d8",
            "#f58231",
            "#911eb4",
            "#46f0f0",
            "#f032e6",
            "#bcf60c",
            "#fabebe",
            "#008080",
            "#e6beff",
            "#9a6324",
            "#fffac8",
            "#800000",
            "#aaffc3",
            "#808000",
            "#ffd8b1",
            "#000075",
];

        const keywordColors = {};
        keywords.forEach((k, i) => {
            keywordColors[k] = colors[i % colors.length]; //キーワードに色を割り当て
        });
        const lines = dataText.split(/[;§\|\{]/).map(l => l.trim());//データテキストを";"と"|"と"§"と"{"ごとに分割
        const results = lines.filter(line => keywords.some(keyword => line.toLowerCase().includes(keyword)));
        const uniqueResults = [...new Set(results)];

        const resultsList = document.getElementById("results");
        resultsList.innerHTML = ""; //既存の内容をクリア
        uniqueResults.forEach(line => {
            let highlighted = line;
            keywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, "gi");
                const color = keywordColors[keyword];
                highlighted = highlighted.replace(regex, `<span style="color:${color}; font-weight:bold;">$1</span>`);
            });
            const li = document.createElement("li");

            const span = document.createElement("span");
            span.innerHTML = highlighted;

            const button = document.createElement("button");
            button.textContent = "📋";
            button.classList.add("copy-button");
            button.style.marginLeft = "8px";
            button.addEventListener("click", () => {
            navigator.clipboard.writeText(line).then(() => {
                button.textContent = "✅";
                setTimeout(() => (button.textContent = "📋"), 1000);
                });
            });

            li.appendChild(span);
            li.appendChild(button);
            resultsList.appendChild(li);
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const loreExtractor = new LoreExtractor();

    const extractButton = document.getElementById("extractButton");
    extractButton.addEventListener("click", () => {
        const dataText = document.getElementById("dataText").value;
        loreExtractor.Extractor(dataText);
    });

    const copyAllButton = document.getElementById("copyAllButton");
    copyAllButton.addEventListener("click", () => {
        const items = document.querySelectorAll("#results li");
        const lines = [];

        items.forEach(li => {
            const span = li.querySelector("span");
            if (span) lines.push(span.innerText.trim());
        });

        navigator.clipboard.writeText(lines.join("\n")).then(() => {
        copyAllButton.textContent = "✅ Copied!";
        setTimeout(() => copyAllButton.textContent = "Copy All", 1000);
    });
    });
});