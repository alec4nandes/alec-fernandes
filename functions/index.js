const express = require("express");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { auth } = require("./db/database.js");
const { signInWithEmailAndPassword } = require("firebase/auth");
const { getMoonSunTidesData } = require("./moon-sun-tides.js");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
// for POST requests
const bodyParser = require("body-parser");

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

signInServer.get("/", async function (req, res) {
    const token = req.cookies.auth,
        isVerified = token && (await admin.auth().verifyIdToken(token));
    if (isVerified) {
        const snapshot = await admin.firestore().collection("posts").get(),
            allPosts = [];
        snapshot.forEach((doc) =>
            allPosts.push({ post_id: doc.id, ...doc.data() })
        );
        res.render("posts", { allPosts });
        return;
    }
    res.render("sign-in");
});

signInServer.post("/", async function (req, res) {
    try {
        const { email, password } = req.body,
            { user } = await signInWithEmailAndPassword(auth, email, password);
        // Signed in
        // Make cookie
        const token = (await user.getIdToken()) || "",
            maxAge = token ? 432000 : 0;
        res.cookie("auth", token, { maxAge });
        res.redirect("./edit");
    } catch (error) {
        res.render("sign-in", { error });
    }
});

signInServer.get("/post", async function (req, res) {
    const { id } = req.query,
        post =
            id &&
            (await admin.firestore().collection("posts").doc(id).get()).data();
    res.render("post", {
        post: post ? { ...post, tags: post.tags.join(", "), post_id: id } : {},
    });
});

signInServer.post("/update", async function (req, res) {
    const data = {
        ...req.body,
        tags: req.body.tags.split(", "),
        date: new Date(),
    };
    const id = data.post_id;
    delete data.post_id;
    await admin.firestore().collection("posts").doc(id).set(data);
    res.send(`
        <p>Post updated!</p>
        <p>
            <a href="../edit">back to admin</a>
        </p>
    `);
});

signInServer.get("/delete", async function (req, res) {
    const { id } = req.query;
    await admin.firestore().collection("posts").doc(id).delete();
    res.send(`
        <p>Post deleted!</p>
        <p>
            <a href="../edit">back to admin</a>
        </p>
    `);
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
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Thank you!</title>
                    <style>
                        body, html {
                            height: 100%;
                        }

                        body {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                            font-family: Arial, sans-serif;
                        }

                        h1, p {
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <h1>Thanks for reaching out!</h1>
                    <p>I'll be in touch with you shortly.</p>
                    <p>
                        Best,
                        <br/>
                        <em>Alec Fernandes</em>
                    </p>
                    <a href="https://fern.haus">home</a>
                </body>
            </html>
        `);
    });
});

// END CONTACT FORM

module.exports = { edit, moon_sun_tides_api, sendMailOverHTTP };
