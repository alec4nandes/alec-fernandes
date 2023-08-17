function toggleNavMenu(isOpening) {
    const elem = document.querySelector(".subscribe nav");
    elem.classList.remove("closed", "open");
    elem.classList.add(isOpening ? "open" : "closed");
}

function copyLink(e) {
    const { id } = e.target.dataset,
        url = `https://fern.haus/blog/${id}.html`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
}

// parse all dates to local device timezone
document.querySelectorAll(".date-posted").forEach(
    (elem) =>
        (elem.textContent = new Date(elem.textContent.trim())
            .toLocaleDateString("en-us", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            })
            .replace("AM", "am")
            .replace("PM", "pm"))
);
