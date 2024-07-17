import { work } from "./work.mjs";

makeListItems("article");
makeListItems("recap");

function makeListItems(type) {
    const items = work
            .filter(({ type: t }) => t.toLowerCase() === type)
            .sort(
                ({ date: dateA }, { date: dateB }) =>
                    new Date(dateB).getTime() - new Date(dateA).getTime()
            ),
        plural = type + "s",
        c2c = `c2c-${plural}`;
    document.querySelector("#" + c2c).innerHTML = items
        .map((item) => {
            const { url, title } = item,
                fileName = url.split("/").filter(Boolean).at(-1);
            return `
                <li>
                    <a href="${c2c}/${fileName}/index.html">${title}</a>
                </li>
            `;
        })
        .join("");
}
