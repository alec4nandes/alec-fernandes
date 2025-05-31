const { db } = require("./database.js"),
    jsdom = require("jsdom"),
    { JSDOM } = jsdom;

async function getPostsData() {
    const querySnapshot = await db.collection("posts").get(),
        result = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // don't add drafts
        if (!data.is_draft) {
            // fix tabs in <pre> tags
            data.content = data.content.replaceAll("&#9;", "  ");
            result.push({
                ...data,
                post_id: doc.id,
                blurb: getBlurb(data, 200),
            });
        }
    });
    result.sort(sortDateDescending);
    return result;
}

function getBlurb(post, maxLength) {
    const dom = new JSDOM(`<body>${post.content}</body>`),
        blurbElem = dom.window.document.querySelector(".blurb");
    if (blurbElem) {
        const blurb = blurbElem.textContent.slice(0, maxLength),
            words = blurb.split(" "),
            isMaxLength = blurb.length === maxLength;
        // remove last incomplete word
        isMaxLength && words.pop();
        const result = words.join(" ").trim(),
            endsWithPunc = [".", ",", ":", ";", "!", "?"].includes(
                result.charAt(result.length - 1)
            );
        return endsWithPunc && isMaxLength
            ? result.slice(0, -1) + "..."
            : isMaxLength
            ? result + "..."
            : result;
    }
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
