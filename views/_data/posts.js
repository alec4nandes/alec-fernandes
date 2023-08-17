// const { setDoc, doc } = require("firebase/firestore");
// const { app } = require("./database.js");
// const { initializeApp, deleteApp } = require("firebase/app");
// const { getFirestore } = require("firebase/firestore");
// const { firebaseConfig } = require("./firebase-config.js");
const { getPostsData } = require("./db/get-posts.js");

module.exports = async function () {
    const allPosts = await getPostsData("posts"),
        tagData = groupTags(allPosts);

    /* transfer data */
    // await deleteApp(app);
    // const app2 = initializeApp(firebaseConfig),
    //     db2 = getFirestore(app2);
    // allPosts.forEach(async (post) => {
    //     const copy = { ...post },
    //         id = copy.post_id;
    //     delete copy.post_id;
    //     await setDoc(doc(db2, "posts", id), copy);
    // });

    return {
        all_posts: allPosts,
        latest_posts: allPosts.slice(0, 5),
        projects: getProjects(allPosts),
        all_tags: getAllTags(allPosts),
        tag_data: tagData,
        // for generating tag pages
        // (tags are case-insensitive)
        tag_data_keys: Object.keys(tagData),
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
