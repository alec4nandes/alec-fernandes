/*
    <script src="/__/firebase/8.10.1/firebase-app.js"></script>
    <script src="/__/firebase/8.10.1/firebase-auth.js"></script>
    <script src="/admin/scripts/auth.js" type="module" defer></script>
*/

import config from "./db-dev.mjs";
import { handleAiPost, handleAiTweet } from "./content.mjs";
import {
    handleRevise,
    handleAccept,
    handleReject,
} from "./ai-editor/editor.mjs";

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(async (user) => {
    const signInpath = "/admin/sign-in.html",
        isSignInPage = window.location.href.includes(signInpath);
    if (!user && !isSignInPage) {
        window.location.href = signInpath;
        return;
    }
    if (user && isSignInPage) {
        window.location.href = "/admin";
        return;
    }
    const formElem = document.querySelector("form#edit");
    if (formElem) {
        const postBtn = formElem.querySelector("button#ai-post"),
            tweetBtn = formElem.querySelector("button#ai-tweet"),
            revisePostBtn = formElem.querySelector("button.post.revise-btn"),
            reviseTweetBtn = formElem.querySelector("button.tweet.revise-btn"),
            acceptPostBtn = formElem.querySelector("button.post.accept-btn"),
            acceptTweetBtn = formElem.querySelector("button.tweet.accept-btn"),
            rejectPostBtn = formElem.querySelector("button.post.reject-btn"),
            rejectTweetBtn = formElem.querySelector("button.tweet.reject-btn"),
            token = await user.getIdToken(true);
        postBtn.onclick = (e) => handleAiPost(e, token);
        tweetBtn.onclick = (e) => handleAiTweet(e, token);
        revisePostBtn.onclick = (e) => handleRevise(e, token, "post");
        reviseTweetBtn.onclick = (e) => handleRevise(e, token, "tweet");
        acceptPostBtn.onclick = (e) => handleAccept(e, "post");
        acceptTweetBtn.onclick = (e) => handleAccept(e, "tweet");
        rejectPostBtn.onclick = (e) => handleReject(e, "post");
        rejectTweetBtn.onclick = (e) => handleReject(e, "tweet");
    }
});

const signInElem = document.querySelector("form#sign-in");
signInElem && (signInElem.onsubmit = handleSignIn);

async function handleSignIn(e) {
    try {
        e.preventDefault();
        const email = e.target.email.value,
            password = e.target.pw.value,
            userCredential = await firebase
                .auth()
                .signInWithEmailAndPassword(email, password);
        window.location.href = "/admin";
    } catch (err) {
        console.error(err);
        alert(err);
    }
}

const signOutBtns = [...document.querySelectorAll(".sign-out")];
signOutBtns.forEach((btn) => (btn.onclick = () => firebase.auth().signOut()));
