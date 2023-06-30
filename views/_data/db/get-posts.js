const { collection, getDocs } = require("firebase/firestore");
const { db } = require("./database.js");

// type is "posts" or "drafts"
async function getPostsData(type) {
    const querySnapshot = await getDocs(collection(db, type)),
        result = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        result.push({
            ...data,
            post_id: doc.id,
        });
    });
    result.sort(sortDateDescending);
    return result;

    function sortDateDescending(postA, postB) {
        return new Date(postB.date).getTime() - new Date(postA.date).getTime();
    }
}

module.exports = { getPostsData };
