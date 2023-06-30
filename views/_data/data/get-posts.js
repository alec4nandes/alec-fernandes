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
            formatted_date: formatDate(data.date),
            post_id: doc.id,
        });
    });
    result.sort(sortDateDescending);
    return result;

    function sortDateDescending(postA, postB) {
        return postA.date && postB.date
            ? postB.date.seconds - postA.date.seconds
            : 0;
    }
}

function formatDate(timestamp) {
    if (!timestamp) {
        return;
    }
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

module.exports = { getPostsData };
