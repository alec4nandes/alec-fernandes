import { work } from "./work.mjs";

makeListItems("article");
makeListItems("recap");

function makeListItems(type) {
    const items = work
            .filter(({ type: t }) => t.toLowerCase() === type)
            .sort(sortDateDescending),
        plural = type + "s",
        c2c = `c2c-${plural}`;
    document.querySelector("#" + c2c).innerHTML = items
        .map((item) => makeListItem({ item, c2c }))
        .join("");
}

function sortDateDescending({ date: dateA }, { date: dateB }) {
    return new Date(dateB).getTime() - new Date(dateA).getTime();
}

function makeListItem({ item, c2c }) {
    const { url, title } = item,
        fileName = url.split("/").filter(Boolean).at(-1);
    return `
        <li>
            <a href="${c2c}/${fileName}/index.html" target="_blank">
                ${title}
            </a>
        </li>
    `;
}
