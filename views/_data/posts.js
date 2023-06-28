const { collection, getDocs, setDoc, doc } = require("firebase/firestore");
const { app, db } = require("./database.js");
const { initializeApp, deleteApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { firebaseConfig } = require("./firebase-config");

module.exports = async function () {
    const allPosts = await getPostsData("posts"),
        tagData = groupTags(allPosts);

    // transfer data
    await deleteApp(app);
    const app2 = initializeApp(firebaseConfig),
        db2 = getFirestore(app2);
    allPosts.forEach(async (post) => {
        const copy = { ...post },
            id = copy.post_id;
        delete copy.post_id;
        delete copy.formatted_date;
        await setDoc(doc(db2, "posts", id), copy);
    });

    return {
        all_posts: allPosts,
        latest_post: allPosts[0],
        projects: getProjects(allPosts),
        all_tags: getAllTags(allPosts),
        tag_data: tagData,
        // for generating tag pages
        // (tags are case-insensitive)
        tag_data_keys: Object.keys(tagData),
    };
};

/* READ POSTS FROM DB */

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
    const tags = posts.map(({ tags }) => tags).flat(Infinity);
    return [...new Set(tags)].sort();
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
