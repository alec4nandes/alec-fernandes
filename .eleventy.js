const { collection, getDocs } = require("firebase/firestore");
const { db } = require("./public/src/database.js");

module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection("posts", async function () {
        const allPosts = await getPublishedPosts();
        return {
            all_posts: allPosts,
            latest_post: allPosts[0],
            projects: getProjects(allPosts),
            all_tags: getAllTags(allPosts),
        };
    });

    return {
        dir: {
            input: "public/views",
            output: "public",
        },
    };
};

/* READ POSTS FROM DB */

async function getPublishedPosts() {
    return await getPostsData("posts");
}

// type is "posts" or "drafts"
async function getPostsData(type) {
    const querySnapshot = await getDocs(collection(db, type)),
        result = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        result.push({
            ...data,
            formatted_date: formatDate(data.date),
            post_id: doc.id,
        });
    });
    result.sort(sortDateDescending);
    return result;

    function sortDateDescending(postA, postB) {
        return postB.date.seconds - postA.date.seconds;
    }
}

function formatDate(timestamp) {
    const utcDate = new Date(timestamp.seconds * 1000),
        localDateString = utcDate.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
        }),
        d = new Date(localDateString),
        months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        month = months[d.getMonth()],
        day = d.getDate(),
        year = d.getFullYear(),
        hours = d.getHours(),
        hour = hours % 12 || 12,
        minutes = ("" + d.getMinutes()).padStart(2, "0"),
        amPm = hours < 12 ? "am" : "pm";
    return `${month} ${day}, ${year} at ${hour}:${minutes} ${amPm} PST`;
}

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
    const tags = posts.map(({ tags }) => tags).flat(Infinity),
        unique = [...new Set(tags)];
    unique.sort();
    return unique;
}
