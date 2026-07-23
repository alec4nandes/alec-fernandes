import { getBilaraSuttaLines, getSuttaCitation } from "../suttas.js";

export default async function Truths(truths) {
    return (
        await Promise.all(
            Object.values(truths).map(
                async (arr) => `
                    <div class="truths">
                        ${(await Promise.all(arr.map((truth) => Truth({ truth })))).join("")}
                    </div>
                `,
            ),
        )
    ).join("");
}

async function Truth({ truth }) {
    return `
        <div class="truth">
            <p class="statement">${truth.statement}</p>
            ${
                truth.subpoints
                    ? `
                        <ul class="subpoints">
                            ${truth.subpoints.map((subpoint) => `<li>${subpoint}</li>`).join("")}
                        </ul>
                    `
                    : ""
            }
            ${(
                await Promise.all(
                    truth.suttas?.map((sutta) => Passage({ sutta })) || [],
                )
            ).join("")}
            ${(truth.passage_refs || [])
                .map(
                    (ref) => `
                        <a class="passage-ref" href="${`#${ref}`}">
                            ${ref}
                        </a>
                    `,
                )
                .join("")}
            ${
                truth.seals
                    ? `
                        <span>
                            <u>Dharma Seals</u>:
                        </span>
                        ${(await Promise.all(truth.seals.map((seal) => Truth({ truth: seal })))).join("")}
                    `
                    : ""
            }
        </div>
    `;
}

async function Passage({ sutta }) {
    async function getPassageText() {
        const text = await getBilaraSuttaLines(sutta.id, "sujato"),
            entries = Object.entries(text),
            from = entries.findIndex(([key]) => key === sutta.passage.from),
            to = entries.findIndex(([key]) => key === sutta.passage.to) + 1;
        return entries.slice(from, to).map(([, text]) => text);
    }

    return `
        <details id="${sutta.topic}" class="passage">
            <summary class="passage-topic">${sutta.topic}</summary>
            <p class="passage-text">
                ${await getPassageText().then((lines) => {
                    return (lines || [])
                        .map((line) => `<span>${line}</span>`)
                        .join("");
                })}
            </p>
            ${await getSuttaCitation(sutta.id, "sujato").then((citation) => {
                return citation
                    ? `
                        <p class="passage-citation">
                            &mdash;
                            <a href="https://suttacentral.net/${sutta.id}/en/sujato" target="_blank">
                                ${citation}
                            </a>
                        </p>
                    `
                    : "";
            })}
        </details>
    `;
}
