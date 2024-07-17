import { mkdirp } from "mkdirp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { work } from "./work.mjs";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

writeAll();

async function writeAll() {
    for (const { fileName, type, url } of work) {
        await writeHTML({ fileName, type, url });
    }
}

async function writeHTML({ fileName, type, url }) {
    const plural = type.toLowerCase() + "s",
        filePath = `${__dirname}/../c2c-${plural}/${fileName}/`,
        rawPath = `${filePath}raw.txt`,
        raw = fs.readFileSync(rawPath, "utf8"),
        { html, assets, styles } = parseRaw({ raw, url });
    fs.writeFileSync(filePath + "index.html", html);
    await mkdirp(filePath + "assets");
    await mkdirp(filePath + "styles");
    for (const { src, fileName } of assets) {
        const response = await fetch(src),
            imageBuffer = await (await response.blob()).arrayBuffer(),
            imageData = Buffer.from(imageBuffer, "binary");
        fs.writeFileSync(filePath + `assets/${fileName}`, imageData);
    }
    for (const { href, fileName } of styles) {
        try {
            const response = await fetch(href),
                text = await response.text();
            fs.writeFileSync(filePath + `styles/${fileName}`, text);
        } catch (err) {
            console.log(href);
            console.log(err);
        }
    }
    console.log("DONE WITH", fileName);
}

function parseRaw({ raw, url }) {
    const dom = new JSDOM(raw),
        scripts = [...dom.window.document.querySelectorAll("script")],
        linkTags = [...dom.window.document.querySelectorAll("link")],
        images = [...dom.window.document.querySelectorAll("img")],
        showLessButton = [
            ...dom.window.document.querySelectorAll("button"),
        ].find((btn) => btn.textContent === "Show Less"),
        assets = [],
        styles = [];
    scripts.forEach((script) => script.remove());
    linkTags
        .filter(({ href }) => !href.includes("fonts.googleapis.com"))
        .forEach((linkTag) => {
            const { href } = linkTag,
                fileName = href.split("/").filter(Boolean).at(-1).split("?")[0];
            linkTag.href = "styles/" + fileName;
            styles.push({ href, fileName });
        });
    images
        .filter((img) => !img.getAttribute("aria-hidden"))
        .forEach((img) => {
            const src = (img.dataset.srcset || img.dataset.src || img.src)
                    ?.split(",")[0]
                    .split("?")[0],
                fileName = src.split("/").filter(Boolean).at(-1),
                isProfilePic = img.alt.toLowerCase().includes("profile image"),
                isNooryPic = img.classList.contains("george-noory");
            img.src = "assets/" + fileName;
            if (isProfilePic || isNooryPic) {
                img.style.width = "auto";
            }
            assets.push({ src, fileName });
        });
    showLessButton?.remove();
    dom.window.document.body.innerHTML += `
        <dialog style="max-width: 400px; width: 100%; text-align: center;">
            <p>
                This is a static copy of a webpage from Coast to Coast AM's website.
                The original page can be found
                <a href="${url}" target="_blank">here</a>.
            </p>
            <p>
                This is how the written piece looked at the time of publication,
                preserved as a clip in Alec Fernandes's writing portfolio.
                Not all links or menu buttons may work on this static page.
            </p>
            <p>
                View all my <a href="/portfolio">published writing here</a>,
                or read my <a href="/" target="_blank">personal blog here</a>.
            </p>
            <button id="close">close</button>
        </dialog>
        <style>
            .template-coast, .component-site-header {
                background-image: url(/portfolio/assets/c2c-bg-2024.jpg) !important;
            }
            
            @media screen and (min-width: 1060px) {
                .template-coast {
                    background-image: url(/portfolio/assets/c2c-bg-large-2024.jpg) !important;
                    background-size: cover !important;
                }
            }
        </style>
        <script src="/portfolio/scripts/main.js"></script>
    `;
    return { html: dom.serialize(), assets, styles };
}
