const { db } = require("./database.js");

async function getLinksData() {
    const querySnapshot = await db.collection("links").get(),
        result = [];
    querySnapshot.forEach((doc) => {
        result.push({ ...doc.data(), post_id: doc.id });
    });
    result.sort(sortDateDescending);
    return result;
}

function sortDateDescending(linksA, linksB) {
    const getMs = (date) => new Date(date).getTime();
    return getMs(linksB.date) - getMs(linksA.date);
}

module.exports = { getLinksData };
