const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { getMoonSunTidesData } = require("./moon-sun-tides.js");

// CUSTOM APIs

const mst = express();

// Moon-Sun-Tides API route, sample:
// http://localhost:5001/alec-fernandes/us-central1/moon_sun_tides_api?latitude=32.8400896&longitude=-117.2078592&date=2022-11-30
mst.get("/", function (req, res) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    getMoonSunTidesData(req, res);
});
const moon_sun_tides_api = functions.https.onRequest(mst);

// END CUSTOM APIs

// CONTACT FORM

admin.initializeApp();
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

module.exports = { moon_sun_tides_api, sendMailOverHTTP };
