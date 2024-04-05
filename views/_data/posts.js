const { getPostsData } = require("./db/get-posts.js");

module.exports = async function () {
    const allPosts = (await getPostsData("posts")).map((post) => ({
            ...post,
            blurb: getBlurb(post),
        })),
        tagData = getTagPageList(groupTags(allPosts)),
        allCategories = [
            ...new Set(
                allPosts
                    .map(({ categories }) => categories)
                    .flat(Infinity)
                    .filter(Boolean)
            ),
        ].sort();

    return {
        all_posts: allPosts,
        latest_posts: allPosts.slice(0, 7),
        projects: getProjects(allPosts),
        all_tags: getAllTags(allPosts),
        tag_data: tagData,
        all_categories: allCategories,
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

/* READ POSTS FROM DB */

function getProjects(posts) {
    return posts
        .filter((post) => post.tags.includes("projects"))
        .map((post) => ({
            post_id: post.post_id,
            name: post.post_id.replaceAll("-", " "),
            feature_image: post.feature_image,
        }));
}

function getAllTags(posts) {
    const tags = posts.map(({ tags }) => tags).flat(Infinity);
    return [...new Set(tags)].sort((a, b) => {
        const aLower = a.toLowerCase(),
            bLower = b.toLowerCase();
        return aLower.localeCompare(bLower);
    });
}

function getTagPageList(groupedTags) {
    const POSTS_PER_PAGE = 5,
        result = [];
    for (const [tag, posts] of Object.entries(groupedTags)) {
        let pageNum = 0,
            postsSegment = [];
        for (let i = 0; i < posts.length; i++) {
            postsSegment.push(posts[i]);
            if (i === posts.length - 1 || (i && !((i + 1) % POSTS_PER_PAGE))) {
                result.push({
                    name: tag,
                    posts: [...postsSegment],
                    pagination: {
                        page: ++pageNum,
                        previous: pageNum > 1 && pageNum - 1,
                        next: i < posts.length - 1 && pageNum + 1,
                        max_pages: Math.ceil(posts.length / POSTS_PER_PAGE),
                    },
                });
                postsSegment = [];
            }
        }
    }
    console.log(result);
    return result;
}

function groupTags(posts) {
    return posts.reduce((acc, post) => {
        post.tags.forEach((tag) => {
            const low = tag.toLowerCase();
            acc[low]?.push(post) || (acc[low] = [post]);
        });
        return acc;
    }, {});
}
