const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getAnalytics, isSupported } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyAXm7zEO07LWLpMwB4oev7nlXUsVf1W36E",
    authDomain: "node-blog-369520.firebaseapp.com",
    projectId: "node-blog-369520",
    storageBucket: "node-blog-369520.appspot.com",
    messagingSenderId: "949904482362",
    appId: "1:949904482362:web:da359f622241c0276c9503",
    measurementId: "G-VF2TDGHB7V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig),
    auth = getAuth(app),
    db = getFirestore(app),
    analytics = isSupported().then((yes) => yes && getAnalytics(app));

module.exports = { app, db, auth, analytics };
