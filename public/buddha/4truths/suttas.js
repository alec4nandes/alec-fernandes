async function getSutta(section, translation) {
    let { text, suttaplex } = await getOtherSutta(section, translation);
    if (!text) {
        text = await getBilaraSutta(section, translation);
    }
    return { text, blurb: suttaplex?.blurb };
}

async function getOtherSutta(section, translation = "sujato") {
    const endpoint = `https://suttacentral.net/api/suttas/${section}/${translation}`,
        response = await fetch(endpoint),
        { root_text, suttaplex } = await response.json();
    return { text: root_text?.text, suttaplex };
}

async function getBilaraSutta(section, translation) {
    const { html_text, translation_text } = await getBilaraSuttaText(
        section,
        translation
    );
    return (
        html_text &&
        translation_text &&
        Object.entries(html_text)
            .map(
                ([key, line]) =>
                    translation_text[key] &&
                    line.replace("{}", translation_text[key])
            )
            .join("")
    );
}

async function getBilaraSuttaText(section, translation) {
    const endpoint = `https://suttacentral.net/api/bilarasuttas/${section}/${translation}`,
        response = await fetch(endpoint),
        { html_text, translation_text } = await response.json();
    return { html_text, translation_text };
}

async function getBilaraSuttaLines(section, translation) {
    const { translation_text: lines } = await getBilaraSuttaText(
        section,
        translation
    );
    return lines;
}

async function getSuttaCitation(section, translation) {
    const [chapInfo, { suttaplex }] = await Promise.all([
            getChapterInfo(section),
            getOtherSutta(section, translation),
        ]),
        { original_title, translated_title } = suttaplex;
    return `${chapInfo}: ${translated_title} (${original_title})`;
}

async function getChapterInfo(section) {
    const numIndex = [...section].findIndex((char) => !isNaN(char)),
        chapId = section.slice(0, numIndex),
        { suttaplex } = await getOtherSutta(chapId),
        { original_title } = suttaplex;
    return `${original_title} ${section.replace(chapId, "")}`;
}

export { getSutta, getBilaraSuttaLines, getSuttaCitation };
