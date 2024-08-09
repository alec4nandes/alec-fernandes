redirectRelativeLinks();
addNavMenuHandlers();
// addDialogHandlers();

function redirectRelativeLinks() {
    const links = [...document.querySelectorAll("a")];
    for (const link of links) {
        const { href } = link,
            isRelative = href.includes(window.location.origin);
        if (isRelative) {
            const newHref = href.replace(
                window.location.origin,
                "https://coasttocoastam.com"
            );
            link.href = newHref;
        }
    }
}

function addNavMenuHandlers() {
    document.querySelector(".nav-toggler").onclick = menuToggler;
    document.querySelector(`[aria-label="Close Site Navigation"]`).onclick =
        menuToggler;
    [...document.querySelectorAll(".child-menu-toggler")].forEach(
        (elem) => (elem.onclick = childMenuToggler)
    );
}

function menuToggler() {
    const navElem = document.querySelector("#component-site-nav"),
        isOpen = navElem.classList.contains("open");
    navElem.classList[isOpen ? "remove" : "add"]("open");
}

function childMenuToggler(e) {
    let li = e.target;
    while (!li.classList.contains("menu-top-label")) {
        li = li.parentNode;
    }
    const isOpen = li.classList.contains("open");
    li.classList[isOpen ? "remove" : "add"]("open");
}

// function addDialogHandlers() {
//     const dialog = document.querySelector("dialog"),
//         closeDialog = dialog.querySelector("#close");
//     dialog.showModal();
//     closeDialog.onclick = () => dialog.close();
// }
