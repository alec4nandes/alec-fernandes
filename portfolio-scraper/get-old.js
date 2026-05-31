const fs = require("fs-extra");

async function getOld() {
    const [articles, shows] = await Promise.all([
        getOldHelper("article"),
        getOldHelper("show"),
    ]);
    return { articles, shows };
}

async function getOldHelper(folder) {
    const entries = await fs.readdir(`portfolio/c2c/${folder}`, {
            withFileTypes: true,
        }),
        subdirs = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
    return subdirs;
}

module.exports = { getOld };
