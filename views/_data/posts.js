const { getPostsData } = require("./db/get-posts.js");

module.exports = async function () {
    const allPosts = await getPostsData("posts"),
        tagData = getTagPageList(groupTags(allPosts));

    return {
        all_posts: allPosts,
        latest_posts: allPosts.slice(0, 5),
        projects: getProjects(allPosts),
        all_tags: getAllTags(allPosts),
        tag_data: tagData,
    };
};

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
