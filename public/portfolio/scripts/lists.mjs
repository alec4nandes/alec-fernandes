import { articles, shows, articleSlugs, showDates } from "./work.mjs";

makeListItems("article");
makeListItems("show");

function makeListItems(type) {
    const data = { articles, shows },
        ul = document.querySelector(`#${type}`),
        suffix = type === "show" ? "-show" : "";
    ul.innerHTML = document.querySelector(`#${type}`).innerHTML =
        Object.entries(data[`${type}s`])
            .map(
                ([slug, title]) => `
                <li>
                    <a href="/portfolio/c2c/${type}/${slug}${suffix}/index.html"
                        target="_blank">
                        ${title}
                    </a>
                </li>
            `
            )
            .join("");
}
