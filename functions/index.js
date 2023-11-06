const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
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
} = require("./edit.js");
const { getMoonSunTidesData } = require("./moon-sun-tides.js");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
// for POST requests
const bodyParser = require("body-parser");
// liquid templates
const { Liquid } = require("liquidjs");
const engine = new Liquid();
// for session login instead of cookies
const session = require("express-session");
// express-session needs a "store" other than memory-leaky MemoryStore (default).
// MemoryStore is only good for small-scale development stage.
const { Firestore } = require("@google-cloud/firestore");
const { FirestoreStore } = require("@google-cloud/connect-firestore");
// TODO: create cleanup endpoint for express-session data in Firestore
// It should loop through all the sessions, parse the .data into JSON,
// and then parse the expiration date to see if it has passed.
// If so, delete record.

admin.initializeApp();

// BACKEND SIGN IN

const signInServer = express();
// signInServer.use(bodyParser.json());
signInServer.use(bodyParser.urlencoded({ extended: true }));
signInServer.use(cookieParser());
signInServer.use(
    session({
        store: new FirestoreStore({
            dataset: new Firestore(),
            kind: "express-sessions",
        }),
        secret: "thisismysecretkeylolz1010", // TODO: make env var
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // one week
        resave: false,
    })
);
// register liquid engine
signInServer.engine("liquid", engine.express());
signInServer.set("views", "./views"); // specify the views directory
signInServer.set("view engine", "liquid"); // set liquid to default

signInServer.get(`/${dirNameHome}`, getHomePage);
signInServer.post(`/${dirNameSignIn}`, signInUser);
signInServer.get(`/signout`, signOutUser);
signInServer.get(`/${dirNamePost}`, getPost);
signInServer.post(`/${dirNameUpdate}`, updatePost);
signInServer.get(`/${dirNameDelete}`, deletePost);

const edit = functions.https.onRequest(signInServer);

// END BACKEND SIGN IN

// CUSTOM APIs

// Moon-Sun-Tides API route, sample:
// http://localhost:5001/alec-fernandes/us-central1/moon_sun_tides_api?latitude=32.8400896&longitude=-117.2078592&date=2022-11-30
const mst = express();
mst.get("/", function (req, res) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    getMoonSunTidesData(req, res);
});
const moon_sun_tides_api = functions.https.onRequest(mst);

// END CUSTOM APIs

// CONTACT FORM

/* gmail  credentials */
const transporter = nodemailer.createTransport({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    secure: true,
    auth: {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
    },
});
const sendMailOverHTTP = functions.https.onRequest((req, res) => {
    const data = { ...req.body },
        email = data.email;
    delete data.email;
    Object.entries(data).forEach(
        ([key, value]) => !value.trim() && delete data[key]
    );
    const mailOptions = {
        from: email,
        to: process.env.DB_USER,
        subject: "WEBSITE REQUEST",
        html: `
            <strong>${email} status:</strong>
            <ul>
            ${Object.entries(data)
                .map(([key, value]) => `<li><b>${key}:</b> ${value}</li>`)
                .join("")}
            </ul>
        `,
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            return res.send(error.toString());
        }
        // var data = JSON.stringify(data);
        return res.redirect("https://fern.haus/thanks");
    });
});

// END CONTACT FORM

module.exports = { edit, moon_sun_tides_api, sendMailOverHTTP };
