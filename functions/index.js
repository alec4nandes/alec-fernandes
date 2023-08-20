const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
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
} = require("./edit.js");
const { getMoonSunTidesData } = require("./moon-sun-tides.js");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
// for POST requests
const bodyParser = require("body-parser");
// liquid templates
const { Liquid } = require("liquidjs");
const engine = new Liquid();

admin.initializeApp();

// BACKEND SIGN IN

const signInServer = express();
// signInServer.use(bodyParser.json());
signInServer.use(bodyParser.urlencoded({ extended: true }));
signInServer.use(cookieParser());
// register liquid engine
signInServer.engine("liquid", engine.express());
signInServer.set("views", "./views"); // specify the views directory
signInServer.set("view engine", "liquid"); // set liquid to default

signInServer.get(`/${dirNameHome}`, async function (req, res) {
    await checkAuth(req, res, () => showAllPosts(res), true);
});

signInServer.post(`/${dirNameSignIn}`, async function (req, res) {
    await signInUser(req, res);
});

signInServer.get(`/${dirNamePost}`, async function (req, res) {
    await checkAuth(req, res, () => loadPostData(req, res));
});

signInServer.post(`/${dirNameUpdate}`, async function (req, res) {
    await updatePost(req, res);
});

signInServer.get(`/${dirNameDelete}`, async function (req, res) {
    await checkAuth(req, res, () => deletePost(req, res));
});

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
