function handleCharCount() {
    const charCount = document.querySelector("#tweet-content").innerText.length,
        charCountElem = document.querySelector("#char-count");
    charCountElem.classList[charCount >= 280 ? "add" : "remove"]("too-long");
    charCountElem.innerText =
        charCount + " characters" + (charCount === 1 ? "" : "s");
}

export { handleCharCount };
