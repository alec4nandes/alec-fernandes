/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions"),
    { onRequest } = require("firebase-functions/v2/https"),
    logger = require("firebase-functions/logger");

require("dotenv").config();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// Moon-Sun-Tides API route, sample:
// http://localhost:5001/alec-fernandes/us-central1/moon_sun_tides_api?latitude=32.8400896&longitude=-117.2078592&date=2022-11-30
const { getMoonSunTidesData } = require("./moon-sun-tides.js");

exports.moon_sun_tides_api = onRequest(
    { cors: true },
    async (request, response) => {
        response.send(await getMoonSunTidesData(request));
    },
);

// NEWS

const Parser = require("rss-parser");

exports.news = onRequest({ cors: true }, async (request, response) => {
    const { query, timeframe_ms: timeframe } = request.body,
        endpoint =
            `https://news.google.com/rss/search` +
            `?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    response.send(await getNews({ endpoint, timeframe }));
});

async function getNews({ endpoint, timeframe }) {
    const parser = new Parser(),
        { items } = await parser.parseURL(endpoint),
        cutoff = Date.now() - timeframe,
        getMs = (isoDate) => new Date(isoDate).getTime();
    return items
        .filter(({ isoDate }) => getMs(isoDate) >= cutoff)
        .toSorted((a, b) => getMs(b.isoDate) - getMs(a.isoDate));
}

// SUMMARY

exports.summary = onRequest(
    {
        cors: [
            "https://fern.haus",
            "http://localhost:5002",
            "http://localhost:5173",
        ],
    },
    async (request, response) => {
        const { input } = request.body,
            instructions =
                `Use the url_context tool to read the specified URL and generate a ` +
                `one-paragraph summary that aligns with the provided headline. ` +
                `If the URL is inaccessible, search the web to summarize the topic.`,
            settings = {
                api_key: process.env.GEMINI_API_KEY,
                model: "gemini-3.1-flash-lite",
                stream: false, // Boolean
                search: true, // Boolean, Gemini only
                url_context: true, // Boolean, Gemini only
                temperature: 1.2, // from 0.0 to 2.0, with some restrictions based on model
                instructions, // optional
                input: JSON.stringify(input),
                effort: null, // none < low < medium < high < xhigh // (Claude: < low < medium < high < max)
                budget: 20_000, // Gemini & Claude only, # of tokens for thinking (low ex: 2_000). Gemini: use in place of effort, not alongside
            },
            result = await fetch("https://ai-kmmlvbfnaq-uc.a.run.app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            }).then((resp) => resp.json());
        response.send(result);
    },
);
