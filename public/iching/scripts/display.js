import displayHexagrams, { makeLineInnerHTML } from "./display-hexagrams.js";
import displayText from "./display-text.js";
import getHexagramInfo from "./hexagram-info.js";

const getLineInt = () => ~~(Math.random() * 4);

function addCastHandlers(definitions) {
    const flipButton = document.getElementById("flip-button"),
        flipAllButton = document.getElementById("flip-all-button"),
        noFlipButton = document.getElementById("flip-none-button");
    flipButton && (flipButton.onclick = () => flipHandler(false, definitions));
    flipAllButton &&
        (flipAllButton.onclick = () => flipHandler(true, definitions));
    noFlipButton && (noFlipButton.onclick = () => noFlipHandler(definitions));
}

function display(definitions) {
    const urlParams = new URLSearchParams(window.location.search),
        linesParam = urlParams?.get("lines"),
        info = getHexagramInfo(linesParam);
    info && display_helper(info, definitions);
    // otherwise leave original display for coin flips
}

function copyCurrentReading(info) {
    const numId = info.lines.join(""),
        text = `https://fern.haus/iching/cast/?lines=${numId}`;
    navigator.clipboard.writeText(text);
    alert("Link copied!");
}

function display_helper(info, definitions) {
    displayHexagrams(info, definitions);
    displayText(info, definitions);
    document.querySelector("#share").onclick = () => copyCurrentReading(info);
    document.querySelector("#visible-reading").style.display = "inline-block";
}

let index = 6;

function addLines(alreadExists) {
    if (!alreadExists) {
        const hexagrams = document.createElement("div");
        hexagrams.className = "hexagrams";
        hexagrams.innerHTML = `
        <div class="hexagram">
            <div class="lines">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>`;
        document.querySelector("#reading").appendChild(hexagrams);
    }
}

function flipHandler(flipAllAtOnce, definitions) {
    const flipButton = document.querySelector("#flip-button"),
        flipAllButton = document.querySelector("#flip-all-button"),
        noFlipButton = document.querySelector("#flip-none-button"),
        flipDuration = 1500,
        maxDelay = 1000;
    if (index === 6) {
        [flipAllButton, noFlipButton].forEach(
            (elem) => (elem.style.display = "none")
        );
    }
    if (index > 0) {
        flipButton.disabled = true;
        const reading = document.querySelector("#reading"),
            flipping = document.createElement("div");
        flipping.className = "flipping";
        flipping.innerHTML = `
            <div class="coins-container">
                <div class="coin" style="${getCoinAnimationStyle(
                    flipDuration,
                    maxDelay
                )}">
                    <div class="back side"></div>
                    <div class="front side"></div>
                </div>
                <div class="coin" style="${getCoinAnimationStyle(
                    flipDuration,
                    maxDelay
                )}">
                    <div class="back side"></div>
                    <div class="front side"></div>
                </div>
                <div class="coin" style="${getCoinAnimationStyle(
                    flipDuration,
                    maxDelay
                )}">
                    <div class="back side"></div>
                    <div class="front side"></div>
                </div>
            </div>`;
        // show coin flip elem and then remove
        reading.appendChild(flipping);
        setTimeout(() => {
            addLines(document.querySelector(".hexagrams"));
            reading.removeChild(flipping);
            --index;
            const lines = [...document.querySelectorAll(".line")],
                lineInt = getLineInt(),
                lineNumber = Math.abs(index - 6);
            lines[index].innerHTML = makeLineInnerHTML(lineNumber, lineInt);
            lines[index].setAttribute("data-value", lineInt);
            flipButton.disabled = false;
            const html = flipButton.innerHTML;
            flipButton.innerHTML = index
                ? html.slice(0, html.indexOf("(")) +
                  `(${index} line${index === 1 ? "" : "s"} left)`
                : "read lines";
            flipAllAtOnce && index && flipHandler(flipAllAtOnce, definitions);
        }, flipDuration + maxDelay);
    } else {
        const result = [...document.querySelectorAll(".line")]
            .map((elem) => elem.getAttribute("data-value"))
            .join("");
        display_helper(getHexagramInfo(result), definitions);
        index = 6;
    }
}

function noFlipHandler(definitions) {
    const result = new Array(6)
        .fill(0)
        .map((_) => getLineInt())
        .join("");
    display_helper(getHexagramInfo(result), definitions);
}

function getCoinAnimationStyle(flipDuration, maxDelay) {
    const delay = ~~(Math.random() * maxDelay) / 1000;
    return `animation: 0.25s spin ${delay}s infinite,
        ${flipDuration / 2000}s toss ${delay}s 2 ease-out alternate;`;
}

export { display, addCastHandlers };
