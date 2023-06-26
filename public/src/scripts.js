function toggleNavMenu(isOpening) {
    const elem = document.querySelector(".subscribe nav");
    elem.classList.remove("closed", "open");
    elem.classList.add(isOpening ? "open" : "closed");
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
}
