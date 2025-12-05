async function removeElems(page) {
    await page.evaluate(() => {
        [...document.querySelectorAll("script")].forEach((s) => s.remove());

        [...document.querySelectorAll("iframe")]
            .filter(({ src }) => !src.toLowerCase().includes("youtube.com"))
            .forEach((elem) => elem.remove());

        for (const link of [...document.querySelectorAll("a")]) {
            const { href } = link,
                isRelative = href.includes(window.location.origin);
            if (isRelative) {
                const newHref = href.replace(
                    window.location.origin,
                    "https://coasttocoastam.com"
                );
                link.href = newHref;
            }
        }

        [...document.querySelectorAll("link")].forEach(
            (elem) => elem.rel !== "stylesheet" && elem.remove()
        );

        [...document.querySelectorAll("meta")].forEach(
            (elem) =>
                !elem.getAttribute("charset") &&
                elem.name !== "viewport" &&
                elem.remove()
        );
    });
}

module.exports = { removeElems };
