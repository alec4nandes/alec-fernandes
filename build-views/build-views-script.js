const fs = require("fs"),
    { getCategoriesAndTags } = require("../db/get-posts.js");

getCategoriesAndTags()
    .then(({ categories, tags }) => {
        buildView(true, categories);
        buildView(false, tags);
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

function buildView(isCat, arr) {
    const plural = isCat ? "categories" : "tags",
        caps = isCat ? "CATEGORY" : "TAG",
        file = fs.readFileSync(`build-views/templates/${plural}.html`, "utf8");
    for (const item of arr) {
        const noAmp = item.replaceAll("&", "and"),
            id = noAmp.replaceAll(" ", ""),
            slug = noAmp.replaceAll(" ", "-").toLowerCase(),
            parsed = file
                .replaceAll(`__${caps}_ID__`, id)
                .replaceAll(`__${caps}__`, item);
        fs.writeFileSync(`views/${plural}/${slug}.html`, parsed, (err) => {
            err && console.error(err);
        });
    }
}
