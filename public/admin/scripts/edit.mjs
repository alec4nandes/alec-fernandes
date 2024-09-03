/*
    <script src="/__/firebase/8.10.1/firebase-app.js"></script>
    <script src="/__/firebase/8.10.1/firebase-firestore.js"></script>
    <script src="/admin/scripts/auth.js" type="module" defer></script>
*/

import { handleCharCount } from "./char-count.mjs";

loadPost();

document.querySelector("form#edit").onsubmit = handleUpdatePost;
document.querySelector("input#date").value = parseDate(new Date());
document.querySelector("button#slugify").onclick = handleSlugifyTitle;
document.querySelector("button#format-caption").onclick = handleFormatCaption;
document.querySelector("button#delete").onclick = handleDelete;
document.querySelector("button#format-btn").onclick = handleFormat;
document.querySelector("button#unformat-btn").onclick = handleUnformat;
document.querySelector("#tweet-content").oninput = handleCharCount;

async function loadPost() {
    try {
        const post = await firebase
                .firestore()
                .collection("posts")
                .doc(getPostId())
                .get(),
            { id } = post,
            data = post.data(),
            { is_draft, date, content, tweet, topic } = data,
            getInput = (name) =>
                document.querySelector(`input[name="${name}"]`);
        delete data.is_draft;
        delete data.date;
        delete data.topic;
        getInput("post_id").value = id;
        getInput("is_draft").checked = is_draft;
        getInput("date").value = parseDate(new Date(date));
        document.querySelector("#post-content").innerText = content;
        document.querySelector("#tweet-content").innerText = tweet;
        document.querySelector("textarea#topic").value = topic;
        for (const [key, value] of Object.entries(data)) {
            const input = getInput(key);
            input && (input.value = value);
        }
        handleCharCount();
    } catch (err) {
        console.error(err);
    }
}

function getPostId() {
    const params = new URLSearchParams(document.location.search);
    return params.get("id");
}

async function handleUpdatePost(e) {
    e.preventDefault();
    const post = formatPostData(e.target),
        { post_id } = post;
    delete post.post_id;
    await firebase.firestore().collection("posts").doc(post_id).set(post);
    alert("Post updated!");
    window.location.href = "/admin";
}

function formatPostData(formElem) {
    const post = Object.fromEntries(new FormData(formElem).entries()),
        getContent = (type) =>
            document.querySelector(`#${type}-content`).innerText,
        splitter = (str) =>
            str
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
    post.content = getContent("post");
    post.tweet = getContent("tweet");
    post.is_draft = !!post.is_draft;
    post.categories = splitter(post.categories);
    post.tags = splitter(post.tags);
    post.date += getTimezone(new Date(post.date));
    return post;
}

function getTimezone(date) {
    const tz = (date || new Date()).getTimezoneOffset() / 60,
        tzHours = ~~tz,
        tzMinutes = (tz - tzHours) * 60;
    return `${tz < 0 ? "+" : "-"}${pad(tzHours)}:${pad(tzMinutes)}`;
}

function pad(n) {
    return ("" + n).padStart(2, "0");
}

// yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS".
function parseDate(date) {
    const year = date.getFullYear(),
        month = pad(date.getMonth() + 1),
        day = pad(date.getDate()),
        hour = pad(date.getHours()),
        minute = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function handleSlugifyTitle(e) {
    e.preventDefault();
    const title = document.querySelector("input#title").value,
        slug = title
            .trim()
            .toLowerCase()
            .replaceAll(/[— –]/g, "-")
            .replaceAll(/[‘’“”.,:;—–]/g, "");
    document.querySelector("input#post-id").value = slug;
}

function handleFormatCaption(e) {
    e.preventDefault();
    const captionElem = document.querySelector("input#feature-image-caption"),
        caption = captionElem.value,
        formatted = caption.trim().replaceAll("<a ", `<a target="_blank" `);
    captionElem.value = formatted;
}

async function handleDelete(e) {
    e.preventDefault();
    const proceed = confirm("Are you sure you want to delete this post?");
    if (proceed) {
        await firebase
            .firestore()
            .collection("posts")
            .doc(getPostId())
            .delete();
        alert("Post deleted!");
    }
}

function handleFormat(e) {
    e.preventDefault();
    const contentElem = document
            .querySelector("#post-content")
            .replaceAll(/[“”]/g, '"')
            .replaceAll(/[‘’]/g, "'"),
        paragraphs =
            "<p>\n" +
            contentElem.innerText.trim().replaceAll("\n\n", "\n</p>\n\n<p>\n") +
            "\n</p>";
    contentElem.innerText = paragraphs;
}

function handleUnformat(e) {
    e.preventDefault();
    const contentElem = document.querySelector("#post-content"),
        paragraphs = contentElem.innerText
            .replaceAll("<p>\n", "")
            .replaceAll("\n</p>", "")
            .trim();
    contentElem.innerText = paragraphs;
}
