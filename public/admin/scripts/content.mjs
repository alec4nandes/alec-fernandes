import { openAiStreamed } from "./openai.mjs";
import { handleCharCount } from "./char-count.mjs";

async function handleAiPost(e, token) {
    e.preventDefault();
    return await handlerHelper({ type: "post", token });
}

async function handleAiTweet(e, token) {
    e.preventDefault();
    const postId = document.querySelector("input#post-id").value.trim();
    if (!postId.length) {
        alert("There's no url for the tweet!");
        return;
    }
    const postUrl = `\nhttps://fern.haus/posts/${postId}.html`;
    return await handlerHelper({ type: "tweet", postUrl, token });
}

async function handlerHelper({ type, postUrl, token }) {
    const topic = document.querySelector("textarea#topic").value,
        temperature = +document.querySelector(`input#${type}-temp`).value;
    return await (type === "post" ? getPost : getTweet)({
        topic,
        temperature,
        postUrl,
        token,
    });
}

async function getPost({ topic, temperature, token }) {
    const systemContent =
            "You are a blogger. " +
            "Please write a blog post that's no more than 4 paragraphs. ",
        displayElem = document.querySelector("#post-content"),
        response = await getContentHelper({
            systemContent,
            topic,
            temperature,
            displayElem,
            token,
        });
    return response;
}

async function getTweet({ topic, temperature, postUrl, token }) {
    const maxChar = 280 - postUrl.length,
        systemContent =
            "You are a blogger. " +
            "Write a short tweet that contains hashtags. " +
            `The tweet, including hashtags, must be under ` +
            `${maxChar} characters. ` +
            "Do not write the tweet in quotes.",
        displayElem = document.querySelector("#tweet-content");
    await getContentHelper({
        systemContent,
        topic,
        temperature,
        displayElem,
        token,
    });
    displayElem.textContent += postUrl;
    handleCharCount();
}

async function getContentHelper({
    systemContent,
    topic,
    temperature,
    displayElem,
    token,
}) {
    const prompt = topic && `Write something related to the topic of ${topic}`;
    if (prompt?.trim()) {
        const response = await openAiStreamed({
            systemContent,
            prompt,
            temperature,
            displayElem,
            token,
        });
        // TODO: CHAR COUNT FOR TWEETS
        console.log(response.length);
        return response;
    } else {
        alert("The prompt for this request is empty.");
    }
}

export { handleAiPost, handleAiTweet };
