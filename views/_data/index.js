const { getPostsData, slugifier } = require("../../db/get-posts.js"),
    { getLinksData } = require("../../db/get-links.js"),
    { z } = require("zod");

require("dotenv").config();

module.exports = async function () {
    const allPosts = await getPostsData(),
        nonPortfolioPosts = getNonPortfolioPosts(allPosts),
        top = nonPortfolioPosts[0],
        allLinksData = await getLinksData(),
        links = allLinksData[0].links,
        allLinks = allLinksData.map(({ links }) => links).flat(),
        featured = await getFeatured(top, nonPortfolioPosts),
        coast = findCategory(allPosts, "Coast to Coast AM").toSorted(
            sortDateDescend,
        )[0];
    return {
        top: slugifyCategories(top),
        links,
        all_links: allLinks,
        featured: featured.map(slugifyCategories),
        coast,
    };
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

function slugifyCategories(post) {
    post.categories = post.categories.map((cat) => ({
        name: cat,
        slug: slugifier(cat),
    }));
    return post;
}

async function getFeatured(top, nonPortfolioPosts) {
    console.log("*** SELECTING FEATURED STORIES WITH AI ***");
    const instructions =
            `You are a blogger. Based on this top story, ` +
            `select the best posts to feature from the provided list. ` +
            `Return only 4 slugs to feature on the homepage. ` +
            `If you can't find 4 headlines with any overlap to the top story, ` +
            `Pick the most interesting slugs instead. ` +
            `\nTOP HEADLINE: ${top.title}` +
            (top.subtitle ? `\nTOP SUBTITLE: ${top.subtitle}` : ""),
        noTop = nonPortfolioPosts.filter((post) => post !== top),
        input = noTop.map((post) => ({
            title: post.title,
            subtitle: post.subtitle || undefined,
            slug: post.post_id,
        })),
        body = {
            api_key: process.env.OPENAI_API_KEY,
            model: "gpt-5.4-nano",
            stream: false, // Boolean
            search: false, // Boolean, Gemini only
            url_context: false, // Boolean, Gemini only
            temperature: null, // from 0.0 to 2.0, with some restrictions based on model
            instructions, // optional
            input: JSON.stringify(input),
            effort: "low", // minimal < low < medium < high // (Claude: < low < medium < high < max)
            budget: null, // Gemini & Claude only, # of tokens for thinking (low ex: 2_000). Gemini: use in place of effort, not alongside
            jsonSchema: {
                text: {
                    format: {
                        type: "json_schema",
                        name: "article_slugs",
                        schema: z.toJSONSchema(
                            z.object({ slugs: z.array(z.string()) }),
                        ),
                    },
                },
            },
        },
        data = await fetch("https://ai-kmmlvbfnaq-uc.a.run.app", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((resp) => resp.json())
            .catch((err) => console.error(err));
    console.log("COST:", data.cost);
    console.log("USAGE:", data.usage);
    console.log("RESULT:", data.result);
    return data.result.slugs.map((slug) =>
        noTop.find(({ post_id }) => post_id === slug),
    );
}
