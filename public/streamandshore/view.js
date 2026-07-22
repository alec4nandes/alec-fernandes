function formatCreed(data) {
    return `
        <h1 class="belief">${data.belief}</h1>
        <hr/>
        <h2>Ethical Implications</h2>
        <p>${data.expanded.ethical_implications}</p>
        <h2>Moral Action</h2>
        <p>${data.expanded.moral_action}</p>
        <h2>Fruits of Action</h2>
        <p>${data.expanded.fruits_of_action}</p>
    `;
}

function formatThemes(themes) {
    return themes
        .map(
            ({ theme, texts }) => `
                <h2>${theme}</h2>
                ${formatSources(texts)}
            `,
        )
        .join(`<hr class="divider"/>`);
}

function formatSources(texts) {
    return texts
        .map(
            ({ text, source, jesus }) => `
                <p class="religious-text ${jesus ? "jesus-said" : ""}">${text}</p>
                <small><em>${source}</em></small>
            `,
        )
        .join("");
}

export { formatCreed, formatThemes };
