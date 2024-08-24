const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const { serviceAccount } = require("./firebase-config.js");

const app = initializeApp({
        credential: admin.credential.cert(serviceAccount),
    }),
    db = getFirestore(app);

module.exports = { app, db };
