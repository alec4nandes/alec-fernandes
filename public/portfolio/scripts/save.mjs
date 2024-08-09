import fs from "fs";
import { mkdirp } from "mkdirp";

function redirectImgTags(dom) {
    const images = [...dom.window.document.querySelectorAll("img")];
    return images
        .filter((img) => !img.getAttribute("aria-hidden"))
        .map((img) => {
            const src = (img.dataset.srcset || img.dataset.src || img.src)
                    ?.split(",")[0]
                    .split("?")[0],
                fileName = src.split("/").filter(Boolean).at(-1);
            img.src = `assets/${fileName}`;
            return { src, fileName };
        });
}

function redirectLinkTags(dom) {
    const linkTags = [...dom.window.document.querySelectorAll("link")];
    return linkTags
        .filter(({ href }) => !href.includes("fonts.googleapis.com"))
        .map((linkTag) => {
            const { href } = linkTag,
                fileName = href.split("/").filter(Boolean).at(-1).split("?")[0];
            linkTag.href = `styles/${fileName}`;
            return { href, fileName };
        });
}

async function saveAssets({ assets, filePath }) {
    await mkdirp(`${filePath}/assets`);
    await Promise.all(
        assets.map(({ src, fileName }) =>
            saveAsset({ src, fileName, filePath })
        )
    );
}

async function saveAsset({ src, fileName, filePath }) {
    try {
        const response = await fetch(src),
            imageBuffer = await (await response.blob()).arrayBuffer(),
            imageData = Buffer.from(imageBuffer, "binary");
        fs.writeFileSync(`${filePath}/assets/${fileName}`, imageData);
    } catch (err) {
        console.error(src);
        console.error(err);
    }
}

async function saveStylesheets({ styles, filePath }) {
    await mkdirp(`${filePath}/styles`);
    await Promise.all(
        styles.map(({ href, fileName }) =>
            saveStylesheet({ href, fileName, filePath })
        )
    );
}

async function saveStylesheet({ href, fileName, filePath }) {
    try {
        const response = await fetch(href),
            text = await response.text();
        fs.writeFileSync(`${filePath}/styles/${fileName}`, text);
    } catch (err) {
        console.error(href);
        console.error(err);
    }
}

export { redirectImgTags, redirectLinkTags, saveAssets, saveStylesheets };
