const { auth } = require("./db/database.js");
const { signInWithEmailAndPassword } = require("firebase/auth");
const admin = require("firebase-admin");

const dirNameHome = "home",
    dirNameSignIn = "sign-in",
    dirNamePost = "post",
    dirNameUpdate = "update",
    dirNameDelete = "delete",
    goHome = (res) => res.redirect(`./${dirNameHome}`);

async function checkAuth(req, res, func) {
    const userLoggedIn = req.session.authenticated;
    if (userLoggedIn) {
        return await func();
    }
    res.render("sign-in", { dirNameSignIn });
}

function getHomePage(req, res) {
    req.session.save(function (err) {
        err && console.log(err);
        checkAuth(req, res, () => showAllPosts(res));
    });
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
        // will throw error if wrong pw or no user
        req.session.authenticated = true;
        req.session.save(function (err) {
            err && console.log(err);
            goHome(res);
        });
    } catch (error) {
        res.render("sign-in", { dirNameSignIn, error });
    }
}

function signOutUser(req, res) {
    req.session.destroy(function (err) {
        err && console.log(err);
        goHome(res);
    });
}

function getPost(req, res) {
    checkAuth(req, res, () => loadPostData(req, res));
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

function deletePost(req, res) {
    checkAuth(req, res, () => deletePostHelper(req, res));
}

async function deletePostHelper(req, res) {
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
    getHomePage,
    signInUser,
    signOutUser,
    getPost,
    updatePost,
    deletePost,
};
