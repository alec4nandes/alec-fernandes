function getHTML(noble8, lists) {
    let result = "";
    for (const [group, info] of Object.entries(noble8)) {
        const { summary, paths } = info;
        result += `<div class="group"><h2>${group}</h2>` + getSummary(summary);
        for (const [path, pathInfo] of Object.entries(paths)) {
            const {
                summary,
                description,
                lists: l,
                suttas,
                behaviors,
            } = pathInfo;
            result +=
                `<div class="path"><h3>${path}</h3>` +
                getSummary(summary) +
                `<p class="description">${description}</p>` +
                (suttas ? "<hr/>" + makeSuttasList(suttas) : "") +
                "<hr/>" +
                makeBehaviors(behaviors);
            for (const listTitle of l) {
                try {
                    const { summary, items, unordered } = lists[listTitle],
                        isArr = Array.isArray(items),
                        itemsHTML = isArr
                            ? items.map((item) => `<li>${item}</li>`).join("")
                            : Object.entries(items)
                                  .map(
                                      ([group, items]) =>
                                          `<p><u>${group}</u></p>` +
                                          `<ul>${items
                                              .map((item) => `<li>${item}</li>`)
                                              .join("")}</ul>`,
                                  )
                                  .join("");
                    result +=
                        `<div class="list"><h4>${listTitle}</h4>` +
                        getSummary(summary) +
                        (isArr
                            ? unordered
                                ? `<ul>${itemsHTML}</ul>`
                                : `<ol>${itemsHTML}</ol>`
                            : itemsHTML) +
                        `</div>`;
                } catch (err) {
                    console.error(err);
                    console.warn(listTitle);
                }
            }
            result += `</div>`;
        }
        result += `</div><hr/>`;
    }
    return result;
}

function getSummary(summary) {
    return summary ? `<p class="summary"><em>${summary}</em></p>` : "";
}

function makeBehaviors(behaviors) {
    const { good, bad } = behaviors;
    return makeBehavior(good, true) + "<hr/>" + makeBehavior(bad, false);
}

function makeBehavior(behavior, isGood) {
    return `<div class="behavior"><strong>${
        isGood ? "wholesome" : "unwholesome"
    }:</strong><br/>${behavior
        .map((b) => `<em>${b.example}</em><br/>` + makeSuttasList(b.suttas))
        .join("<hr/>")}</div>`;
}

function makeSuttasList(suttas) {
    return `<ul class="suttas-list">${suttas
        .map(
            (id) => `
                <li>
                    <a href="https://suttacentral.net/${id}/en/sujato" target="_blank">
                        ${id}
                    </a>
                </li>
            `,
        )
        .join("")}</ul>`;
}

export { getHTML };
