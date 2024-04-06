const express = require("express");
const functions = require("firebase-functions");
const { getMoonSunTidesData } = require("./moon-sun-tides.js");

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

module.exports = { moon_sun_tides_api };
