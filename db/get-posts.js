const { db } = require("./database.js");

async function getPostsData() {
    const querySnapshot = await db.collection("posts").get(),
        result = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // don't add drafts
        if (!data.is_draft) {
            // fix tabs in <pre> tags
            data.content = data.content.replaceAll("&#9;", "  ");
            result.push({ ...data, post_id: doc.id });
        }
    });
    result.sort(sortDateDescending);
    return result;
}

function sortDateDescending(postA, postB) {
    return new Date(postB.date).getTime() - new Date(postA.date).getTime();
}

async function getCategoriesAndTags() {
    const allPosts = await getPostsData(),
        c = [],
        t = [];
    allPosts.forEach(({ categories, tags }) => {
        c.push(...categories);
        t.push(...tags);
    });
    const format = (arr) =>
        [...new Set(arr)].sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
        );
    return { categories: format(c), tags: format(t) };
}

function slugifier(str) {
    return str
        .replaceAll("&", "and")
        .replaceAll(/[\.\s]/g, "-")
        .toLowerCase();
}

module.exports = {
    getPostsData,
    getCategoriesAndTags,
    sortDateDescending,
    slugifier,
};
