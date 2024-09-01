import format from "./format.mjs";
import { openAiBuffered } from "../openai.mjs";

async function handleRevise(e, token, type) {
    e.preventDefault();
    const displayElem = document.querySelector(`#${type}-content`),
        prompt = displayElem.innerText.trim();
    if (!prompt) {
        alert("Nothing to revise!");
        return;
    }
    displayElem.innerText = "Revising...";
    try {
        const revised = await getOpenAiRevised({ prompt, token }),
            formatted = format({ original: prompt, revised });
        if (formatted) {
            displayElem.innerHTML = formatted;
            const revisedSpans = [...displayElem.querySelectorAll("span")];
            for (const span of revisedSpans) {
                // [...span.querySelectorAll("br")].forEach((br) => br.remove());
                span.onclick = () => handleRevision(span);
            }
        }
        e.target.style.display = "none";
        showHideBtns({ isShowRevise: false, type });
        return true;
    } catch (err) {
        console.error(err);
        alert("There was an error revising.");
    }
}

async function getOpenAiRevised({ prompt, token }) {
    return await openAiBuffered({
        systemContent: "Rewrite the text.",
        prompt,
        temperature: 0.2,
        token,
    });
}

function handleRevision(span) {
    const isRevised = window.confirm("Approve revision?");
    reviseSpan(span, isRevised);
}

function reviseSpan(span, isRevised) {
    const replace = span.querySelector(isRevised ? "b" : "s")?.innerHTML;
    if (replace) {
        span.innerHTML = replace;
        span.onclick = () => {};
        span.classList.remove("revision");
    }
}

function handleAccept(e, type) {
    e.preventDefault();
    handleAcceptReject({ type, isAccept: true });
}

function handleReject(e, type) {
    e.preventDefault();
    handleAcceptReject({ type, isAccept: false });
}

function handleAcceptReject({ type, isAccept }) {
    try {
        const displayElem = document.querySelector(`#${type}-content`),
            spans = [...displayElem.querySelectorAll("span")];
        for (const span of spans) {
            reviseSpan(span, isAccept);
        }
        getPlainText(displayElem);
        showHideBtns({ isShowRevise: true, type });
    } catch (err) {
        console.error(err);
    }
}

function getPlainText(displayElem) {
    displayElem.innerText = displayElem.innerText
        .replaceAll(/[\n]{3,}/g, "\n\n")
        .replaceAll(/[‘’]+/g, "'")
        .replaceAll(/[“”]+/g, '"')
        .trim();
}

function showHideBtns({ isShowRevise, type }) {
    const [reviseBtn, acceptBtn, rejectBtn] = [
        "revise",
        "accept",
        "reject",
    ].map((kind) => document.querySelector(`button.${type}.${kind}-btn`));
    reviseBtn.style.display = isShowRevise ? "inline-block" : "none";
    [acceptBtn, rejectBtn].forEach(
        (btn) => (btn.style.display = isShowRevise ? "none" : "inline-block")
    );
}

export { handleRevise, handleAccept, handleReject };
