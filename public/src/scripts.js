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
