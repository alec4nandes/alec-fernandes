/*
    <script src="/__/firebase/8.10.1/firebase-app.js"></script>
    <script src="/__/firebase/8.10.1/firebase-firestore.js"></script>
    <script src="/admin/scripts/auth.js" type="module" defer></script>
*/

listAllPosts();

async function listAllPosts() {
    const postsSnapshot = await firebase.firestore().collection("posts").get(),
        posts = [],
        listItems = [];
    postsSnapshot.forEach((post) =>
        posts.push({ id: post.id, ...post.data() })
    );
    posts.sort(
        ({ date: aDate }, { date: bDate }) =>
            new Date(bDate).getTime() - new Date(aDate).getTime()
    );
    posts.forEach((post) => {
        const { id, title, date } = post,
            li = document.createElement("li"),
            link = document.createElement("a"),
            dateSpan = document.createElement("span");
        link.href = `/admin/edit.html?id=${id}`;
        link.textContent = title;
        dateSpan.textContent = formatDate(new Date(date));
        dateSpan.classList.add("post-date");
        li.appendChild(link);
        li.appendChild(dateSpan);
        listItems.push(li);
    });
    document.querySelector("ul#posts").append(...listItems);
}

function formatDate(date) {
    const d = new Date(date),
        formatted = d.toLocaleDateString("en-us", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    return formatted;
}
