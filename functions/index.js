const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
/* gmail  credentials */
var transporter = nodemailer.createTransport({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    secure: true,
    auth: {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
    },
});
exports.sendMailOverHTTP = functions.https.onRequest((req, res) => {
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
            <strong>${email} needs:</strong>
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
