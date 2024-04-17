const { getPostsData } = require("../../db/get-posts.js");

module.exports = async function () {
    const allPosts = (await getPostsData("posts")).map((post) => ({
            ...post,
            blurb: getBlurb(post),
        })),
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

function getBlurb(post) {
    const words = post.content.split(`<p class="blurb">`)[1]?.split("</p>")[0],
        regex = /<a [^>]+>(.+?)<\/a>/g,
        matches = {};
    let m;
    while ((m = regex.exec(words))) {
        matches[m[0]] = m[1];
    }
    console.log(matches);
    let result = words;
    for (const [m1, m2] of Object.entries(matches)) {
        result = result?.replaceAll(m1, m2);
    }
    result = result?.slice(0, 200).split(" ");
    // remove last incomplete word
    result?.pop();
    return result?.join(" ");
}

function getData(allPosts, postsKey) {
    const result = {};
    for (const post of allPosts) {
        const arr = post[postsKey];
        for (const item of arr) {
            const key = item.replaceAll("&", "and").replaceAll(" ", "");
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
