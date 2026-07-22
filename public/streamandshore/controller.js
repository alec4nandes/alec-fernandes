import { creed } from "./model.js";
import { formatCreed, formatThemes } from "./view.js";

creed.forEach((data, i) => {
    const topElem = document.querySelector(`#part${i + 1}`),
        creedElem = topElem.querySelector("details.creed");
    creedElem.querySelector("summary .text").innerHTML = data.belief;
    creedElem.querySelector("& > div").innerHTML = formatCreed(data);
    const christianThemes = data.christian_themes,
        buddhistThemes = data.buddhist_themes;
    topElem.querySelector("details.christian > div").innerHTML =
        formatThemes(christianThemes);
    topElem.querySelector("details.zen > div").innerHTML =
        formatThemes(buddhistThemes);
});
