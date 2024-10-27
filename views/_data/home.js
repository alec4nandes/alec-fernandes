const { getPostsData } = require("../../db/get-posts.js");

module.exports = async function () {
    const allPosts = await getPostsData(),
        pnUpdates = allPosts.filter(
            ({ title }) => title.toLowerCase().trim() === "paranormal update"
        ),
        otherPosts = allPosts
            .filter((post) => !pnUpdates.includes(post))
            .reduce((acc, post) => {
                const { categories } = post;
                for (const category of categories) {
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(post);
                }
                return acc;
            }, {});
    const categories = Object.entries(otherPosts)
        .sort(
            ([, postsA], [, postsB]) =>
                new Date(postsB[0].date).getTime() -
                new Date(postsA[0].date).getTime()
        )
        .map(([category, posts]) => ({ category, posts }));
    return {
        pnUpdates: pnUpdates.slice(0, 5),
        categories: categories.slice(0, 4),
    };
};
