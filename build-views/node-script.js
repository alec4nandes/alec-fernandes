const { collection, getDocs } = require("firebase/firestore");
const { db } = require("../views/_data/db/database.js");
const fs = require("fs");

async function getArrays() {
    const querySnapshot = await getDocs(collection(db, "posts")),
        c = [],
        t = [];
    querySnapshot.forEach((doc) => {
        const { categories, tags } = doc.data();
        c.push(...categories);
        t.push(...tags);
    });
    const format = (arr) =>
        [...new Set(arr)].sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
        );
    return { categories: format(c), tags: format(t) };
}

getArrays()
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
        file = fs.readFileSync(`build-views/${plural}.html`, "utf8");
    for (const item of arr) {
        const id = item.replaceAll(" ", ""),
            slug = item.replaceAll(" ", "-").toLowerCase(),
            parsed = file
                .replaceAll(`__${caps}_ID__`, id)
                .replaceAll(`__${caps}__`, item);
        fs.writeFileSync(`views/${plural}/${slug}.html`, parsed, (err) => {
            err && console.error(err);
        });
    }
}
