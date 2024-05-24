// TODO: move this and .env to blog folder
// TODO: add deploy-script.js to .gitignore in blog folder

// db functions

const { initializeApp } = require("firebase/app"),
    {
        collection,
        doc,
        getDoc,
        getDocs,
        getFirestore,
        setDoc,
    } = require("firebase/firestore"),
    { getAuth, signInWithEmailAndPassword } = require("firebase/auth"),
    { firebaseConfig } = require("./firebase-config-node.js"),
    app = initializeApp(firebaseConfig),
    db = getFirestore(app),
    auth = getAuth(app);

async function getLatestTweet() {
    const latestPost = (await getAllPosts())[0],
        { tweet } = latestPost;
    return tweet;
}

async function getAllPosts() {
    const querySnapshot = await getDocs(collection(db, "dharma")),
        all = [];
    querySnapshot.forEach((doc) => {
        all.push({ post_id: doc.id, ...doc.data() });
    });
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return all;
}

async function getLastPostedTweet() {
    const { last_tweet } = (await getDoc(doc(db, "tweets", "dharma"))).data();
    return last_tweet;
}

async function signIn() {
    const email = process.env.FIREBASE_EMAIL,
        password = process.env.FIREBASE_PASSWORD;
    await signInWithEmailAndPassword(auth, email, password);
    return true;
}

async function setLastPostedTweet(tweetText) {
    await setDoc(doc(db, "tweets", "dharma"), { last_tweet: tweetText });
    console.log("Last tweet updated.");
}

// tweet functions

require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

async function deployTweet() {
    const latestTweet = await getLatestTweet(),
        lastPosted = await getLastPostedTweet(),
        signedIn = await signIn();
    if (signedIn && latestTweet !== lastPosted) {
        const tweetedSuccessfully = await postTweet(latestTweet);
        if (tweetedSuccessfully) {
            await setLastPostedTweet(latestTweet);
        }
    } else {
        console.log("This tweet was posted on the last deploy!");
    }
}

async function postTweet(tweetText) {
    const client = new TwitterApi({
        appKey: process.env.X_API_KEY,
        appSecret: process.env.X_API_KEY_SECRET,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    });
    try {
        const tweet = await client.v2.tweet(tweetText);
        console.log(`Tweet posted with ID ${tweet.data.id}`);
        return true;
    } catch (error) {
        console.error(`Failed to post tweet: ${error}`);
        return false;
    }
}

deployTweet().then(() => process.exit());
