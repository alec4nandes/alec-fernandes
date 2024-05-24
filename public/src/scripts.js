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

const openMenuBtn = document.querySelector("#hamburger-menu-button"),
    closeMenuBtn = document.querySelector("#close-menu"),
    menu = document.querySelector("#hamburger-menu");

if (openMenuBtn) {
    openMenuBtn.onclick = () => {
        openMenuBtn.style.display = "none";
        menu.classList.remove("closed");
    };
}

if (closeMenuBtn) {
    closeMenuBtn.onclick = () => {
        openMenuBtn.style.display = "block";
        menu.classList.add("closed");
    };
}
