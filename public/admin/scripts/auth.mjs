/*
    <script src="/__/firebase/8.10.1/firebase-app.js"></script>
    <script src="/__/firebase/8.10.1/firebase-auth.js"></script>
    <script src="/admin/scripts/auth.js" type="module" defer></script>
*/

import config from "./db-dev.mjs";
import { handleAiPost, handleAiTweet } from "./content.mjs";

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
    const postBtn = document.querySelector("button#ai-post"),
        tweetBtn = document.querySelector("button#ai-tweet"),
        token = await user.getIdToken(true);
    postBtn && (postBtn.onclick = (e) => handleAiPost(e, token));
    tweetBtn && (tweetBtn.onclick = (e) => handleAiTweet(e, token));
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
