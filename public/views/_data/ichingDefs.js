const { definitions } = require("./iching-definitions.js");

module.exports = function () {
    return {
        definitions: convertKeysToLinks(definitions),
        table_data: getHexagramTableData(),
    };
};

function convertKeysToLinks(definitions) {
    return Object.fromEntries(
        Object.entries(definitions).map(([key, def]) => [
            key
                .split("/")
                .map(
                    (bagua) =>
                        `<a href="/iching/bagua/${bagua}.html">${bagua}</a>`
                )
                .join(" / "),
            def,
        ])
    );
}

function getHexagramTableData() {
    const baguaNames = [
        "heaven",
        "earth",
        "fire",
        "water",
        "lake",
        "mountain",
        "thunder",
        "wind",
        "",
    ];
    let result = [];
    for (let i = 0; i < baguaNames.length; i++) {
        result.push(new Array(baguaNames.length).fill(""));
    }
    Object.entries(definitions).forEach(([key, value]) => {
        const names = key.split("/"),
            [i1, i2] = names
                // the columns should be the top trigrams
                // because the headings are on top:
                .reverse()
                .map((name, i) => baguaNames.indexOf(name)),
            heading = `
                <a href="/iching/bagua/${names[1]}.html">
                    ${names[1].slice(0, 4)}
                </a>
            `;
        result[i1 + 1][
            i2 + 1
        ] = `<a href="/iching/text#${value.number}">${value.number}</a>`;
        result[0][i2 + 1] = heading;
        result[i2 + 1][0] = heading;
    });
    return result;
}
