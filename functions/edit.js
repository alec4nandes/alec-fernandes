const { auth } = require("./db/database.js");
const { signInWithEmailAndPassword } = require("firebase/auth");
const admin = require("firebase-admin");

const dirNameHome = "home",
    dirNameSignIn = "sign-in",
    dirNamePost = "post",
    dirNameUpdate = "update",
    dirNameDelete = "delete",
    goHome = (res) => res.redirect(`./${dirNameHome}`);

async function checkAuth(req, res, func, isSignIn) {
    const userLoggedIn = await isUserLoggedIn(req);
    if (userLoggedIn) {
        return await func();
    }
    if (isSignIn) {
        res.render("sign-in", { dirNameSignIn });
        return;
    }
    goHome(res);
}

async function isUserLoggedIn(req) {
    const token = req.cookies.auth,
        isVerified = token && (await admin.auth().verifyIdToken(token));
    return !!isVerified;
}

async function showAllPosts(res) {
    const snapshot = await admin.firestore().collection("posts").get(),
        allPosts = [];
    snapshot.forEach((doc) =>
        allPosts.push({
            ...doc.data(),
            post_id: doc.id,
        })
    );
    allPosts.sort(
        (postA, postB) =>
            new Date(postB.date).getTime() - new Date(postA.date).getTime()
    );
    res.render("posts", { dirNamePost, allPosts });
    return;
}

async function signInUser(req, res) {
    try {
        const { email, password } = req.body,
            { user } = await signInWithEmailAndPassword(auth, email, password);
        // Signed in
        // Make cookie
        const token = (await user.getIdToken()) || "",
            maxAge = token ? 432000 : 0;
        res.cookie("auth", token, { maxAge });
        goHome(res);
    } catch (error) {
        res.render("sign-in", { dirNameSignIn, error });
    }
}

async function loadPostData(req, res) {
    const { id } = req.query,
        post =
            id &&
            (await admin.firestore().collection("posts").doc(id).get()).data();
    res.render("post", {
        dirNameHome,
        dirNameUpdate,
        dirNameDelete,
        post: post
            ? {
                  ...post,
                  tags: post.tags.join(", "),
                  post_id: id,
              }
            : {},
    });
    return;
}

async function updatePost(req, res) {
    const data = {
        ...req.body,
        tags: req.body.tags.split(", "),
    };
    const id = data.post_id;
    delete data.post_id;
    await admin.firestore().collection("posts").doc(id).set(data);
    res.render("confirm", { dirNameHome, type: "updated" });
}

async function deletePost(req, res) {
    const { id } = req.query;
    await admin.firestore().collection("posts").doc(id).delete();
    res.render("confirm", { dirNameHome, type: "deleted" });
    return;
}

module.exports = {
    dirNameHome,
    dirNameSignIn,
    dirNamePost,
    dirNameUpdate,
    dirNameDelete,
    checkAuth,
    showAllPosts,
    signInUser,
    loadPostData,
    updatePost,
    deletePost,
};
