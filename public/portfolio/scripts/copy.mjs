import { fileURLToPath } from "url";
import path from "path";
import { mkdirp } from "mkdirp";
import fs from "fs";
import { articleSlugs, showDates } from "./work.mjs";
import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import {
    redirectImgTags,
    redirectLinkTags,
    saveAssets,
    saveStylesheets,
} from "./save.mjs";

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename),
    topDir = `${__dirname}/../c2c`;

await mkdirp(topDir);

const articleUrl = "https://www.coasttocoastam.com/article/",
    showUrl = "https://www.coasttocoastam.com/show/",
    existingPages = getExistingPages(),
    getNewSlugs = (slugs) =>
        slugs.filter((slug) => !existingPages.includes(slug)),
    articleUrls = getNewSlugs(articleSlugs).map((slug) => articleUrl + slug),
    showSlugs = showDates.map((date) => date + "-show"),
    showUrls = getNewSlugs(showSlugs).map((slug) => showUrl + slug),
    data = { article: articleUrls, show: showUrls };

for (const [directory, value] of Object.entries(data)) {
    await mkdirp(`${topDir}/${directory}`);
    for (const url of value) {
        const subDirectory = url.split("/").filter(Boolean).at(-1);
        await scrape({ url, directory, subDirectory });
    }
}

console.log("DONE!");

function getExistingPages() {
    return getDirectories(topDir)
        .map((dir) => getDirectories(`${topDir}/${dir}`))
        .flat();
}

function getDirectories(source) {
    return fs
        .readdirSync(source, { withFileTypes: true })
        .map(({ name }) => name);
}

async function scrape({ url, directory, subDirectory }) {
    try {
        const browser = await puppeteer.launch({ headless: false }),
            page = await browser.newPage();
        console.log(`Scraping from: ${url}...`);
        await page.goto(url);
        const source = await waitForLoad({ page, ms: 5000 });
        await writeFile({ source, directory, subDirectory });
        await browser.close();
    } catch (err) {
        console.log(err);
    }
}

function waitForLoad({ page, ms }) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                // open bumper music
                await page.click(".bumper-music button");
            } catch (err) {
                console.log("No bumper music on this page!");
            }
            resolve(await page.content());
        }, ms);
    });
}

async function writeFile({ source, directory, subDirectory }) {
    const dom = new JSDOM(source),
        assets = redirectImgTags(dom),
        styles = redirectLinkTags(dom),
        filePath = `${topDir}/${directory}/${subDirectory}`;
    removeBumperBtn(dom);
    removeScriptTags(dom);
    addMyScriptTag(dom);
    await saveAssets({ assets, filePath });
    await saveStylesheets({ styles, filePath });
    await mkdirp(`${topDir}/${directory}/${subDirectory}`);
    fs.writeFileSync(`${filePath}/index.html`, dom.serialize());
}

function removeBumperBtn(dom) {
    dom.window.document.querySelector(".bumper-music button")?.remove();
}

function removeScriptTags(dom) {
    const scripts = [...dom.window.document.querySelectorAll("script")];
    scripts.forEach((script) => script.remove());
}

function addMyScriptTag(dom) {
    const script = dom.window.document.createElement("script");
    script.src = "/portfolio/scripts/index.js";
    dom.window.document.body.append(script);
}