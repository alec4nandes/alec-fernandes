const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { slugifier } = require("../../db/get-posts.js");
const { getPostsData, sortDateDescending } = require("../../db/get-posts.js");

module.exports = async function () {
    const allPosts = (await getPostsData()).sort(sortDateDescending),
        getAll = (key) =>
            [
                ...new Set(
                    allPosts
                        .map((post) => post[key])
                        .flat(Infinity)
                        .filter(Boolean)
                ),
            ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
        allCategories = getAll("categories"),
        allTags = getAll("tags");
    return {
        all_posts: allPosts,
        all_categories: allCategories,
        category_data: getData(allPosts, "categories"),
        all_tags: allTags,
        recent_tags: getRecentTags(allPosts, 40),
        tag_data: getData(allPosts, "tags"),
        tags_by_letter: getTagsByLetter(allTags),
    };
};

function getData(allPosts, postsKey) {
    const result = {};
    for (const post of allPosts) {
        const arr = post[postsKey];
        for (const item of arr) {
            const key = slugifier(item);
            result[key] = {
                posts: [...(result[key]?.posts || []), post],
                ...(postsKey === "categories"
                    ? {
                          tags: [
                              ...new Set([
                                  ...(result[key]?.tags || []),
                                  ...post.tags,
                              ]),
                          ].sort((a, b) =>
                              a.toLowerCase().localeCompare(b.toLowerCase())
                          ),
                      }
                    : {}),
            };
        }
    }
    return result;
}

function getRecentTags(allPosts, max) {
    const result = new Set();
    for (const post of allPosts) {
        post.tags.forEach((tag) => result.add(tag));
        if (result.size >= max) {
            break;
        }
    }
    return [...result].slice(0, max);
}

function getTagsByLetter(allTags) {
    let result = allTags.reduce((acc, tag) => {
        let letter = tag.charAt(0).toUpperCase();
        if (!isNaN(letter)) {
            letter = "#";
        }
        if (!acc[letter]) {
            acc[letter] = [];
        }
        acc[letter].push(tag);
        return acc;
    }, {});
    result = Object.entries(result).map(([letter, tags]) => ({
        letter,
        tags,
    }));
    return result;
}
