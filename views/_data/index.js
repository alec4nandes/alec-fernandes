const { getPostsData } = require("../../db/get-posts.js");

module.exports = async function () {
    const allPosts = await getPostsData(),
        nonPortfolioPosts = getNonPortfolioPosts(allPosts),
        top = nonPortfolioPosts[0],
        links = [
            {
                title: "This is an interesting link",
                link: "https://google.com",
                date: "2025-12-02T14:04-08:00",
                notes: `
Lorem ipsum dolor sit amet, consectetur adipiscing
elit. Sed posuere magna sit amet sem ullamcorper
ultrices. Quisque quis tellus turpis. Donec porta
justo et libero auctor semper non at elit. Maecenas
eu arcu ullamcorper, faucibus purus in, auctor arcu.`,
            },
            {
                title: "This is an interesting link",
                link: "https://google.com",
                date: "2025-12-02T14:04-08:00",
                notes: `
Lorem ipsum dolor sit amet, consectetur adipiscing
elit. Sed posuere magna sit amet sem ullamcorper
ultrices. Quisque quis tellus turpis. Donec porta
justo et libero auctor semper non at elit. Maecenas
eu arcu ullamcorper, faucibus purus in, auctor arcu.`,
            },
            {
                title: "This is an interesting link",
                link: "https://google.com",
                date: "2025-12-02T14:04-08:00",
                notes: `
Lorem ipsum dolor sit amet, consectetur adipiscing
elit. Sed posuere magna sit amet sem ullamcorper
ultrices. Quisque quis tellus turpis. Donec porta
justo et libero auctor semper non at elit. Maecenas
eu arcu ullamcorper, faucibus purus in, auctor arcu.`,
            },
            {
                title: "This is an interesting link",
                link: "https://google.com",
                date: "2025-12-02T14:04-08:00",
                notes: `
Lorem ipsum dolor sit amet, consectetur adipiscing
elit. Sed posuere magna sit amet sem ullamcorper
ultrices. Quisque quis tellus turpis. Donec porta
justo et libero auctor semper non at elit. Maecenas
eu arcu ullamcorper, faucibus purus in, auctor arcu.`,
            },
        ],
        featured = await getFeatured(nonPortfolioPosts),
        coast = findCategory(allPosts, "Coast to Coast AM").toSorted(
            sortDateDescend,
        )[0];
    return { top, links, featured, coast };
};

function getNonPortfolioPosts(allPosts) {
    const coastPosts = findCategory(allPosts, "Coast to Coast AM"),
        projectPosts = findCategory(allPosts, "Web Projects"),
        portfolioPosts = [...coastPosts, ...projectPosts];
    return allPosts
        .filter((post) => !portfolioPosts.includes(post))
        .toSorted(sortDateDescend);
}

function findCategory(allPosts, category) {
    return allPosts.filter(({ categories }) =>
        categories
            .map((cat) => cat.trim().toLowerCase())
            .includes(category.toLowerCase()),
    );
}

function sortDateDescend(a, b) {
    const getMs = (date) => new Date(date).getTime();
    return getMs(b.date) - getMs(a.date);
}

// TODO: AI select
async function getFeatured(nonPortfolioPosts) {
    return nonPortfolioPosts.slice(0, 4);
}
