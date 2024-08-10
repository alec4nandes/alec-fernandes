import fs from "fs";
import { mkdirp } from "mkdirp";
import { getSrc } from "./src.mjs";

async function redirectImgTags(dom) {
    const images = [...dom.window.document.querySelectorAll("img")],
        promises = images
            .filter((img) => !img.getAttribute("aria-hidden"))
            .map(async (img) => {
                const src = await getSrc(img),
                    { blob, ext } = await getBlobAndExt(src),
                    fileName = getFileName(src, ext),
                    imgReplace = dom.window.document.createElement("img");
                imgReplace.src = `/portfolio/c2c/resources/${fileName}`;
                img.replaceWith(imgReplace);
                return { src, blob, fileName };
            });
    return await Promise.all(promises);
}

async function getBlobAndExt(src) {
    const response = await fetch(src),
        blob = await response.blob(),
        ext = "." + blob.type.slice(blob.type.indexOf("/") + 1);
    return { blob, ext };
}

function getFileName(src, ext) {
    const pathName = src.split("?")[0].split("/").filter(Boolean),
        fileName = pathName.pop(),
        result =
            [pathName, fileName]
                .flat(Infinity)
                .join("_")
                .replace(/[\/:\.]/g, "_") +
            "_" +
            fileName,
        hasExt = ext ? fileName.includes(ext) : true;
    return result + (hasExt ? "" : ext);
}

function redirectLinkTags(dom) {
    const linkTags = [...dom.window.document.querySelectorAll("link")];
    return linkTags
        .filter(({ href }) => !href.includes("fonts.googleapis.com"))
        .map((linkTag) => {
            const { href } = linkTag,
                fileName = getFileName(href);
            linkTag.href = `/portfolio/c2c/resources/${fileName}`;
            return { href, fileName };
        });
}

async function saveAssets({ assets, filePath }) {
    await mkdirp(`${filePath}/resources`);
    await Promise.all(
        assets.map(({ src, blob, fileName }) =>
            saveAsset({ src, blob, fileName, filePath })
        )
    );
}

async function saveAsset({ src, blob, fileName, filePath }) {
    try {
        const imageBuffer = await blob.arrayBuffer(),
            imageData = Buffer.from(imageBuffer, "binary");
        fs.writeFileSync(`${filePath}/resources/${fileName}`, imageData);
    } catch (err) {
        console.error(src);
        console.error(err);
    }
}

async function saveStylesheets({ styles, filePath, styleReplacements }) {
    await mkdirp(`${filePath}/resources`);
    await Promise.all(
        styles.map(({ href, fileName }) =>
            saveStylesheet({ href, fileName, filePath, styleReplacements })
        )
    );
}

async function saveStylesheet({ href, fileName, filePath, styleReplacements }) {
    try {
        const response = await fetch(href),
            urls = styleReplacements[href] || [];
        let text = await response.text();
        const dirs = href.split("/").filter(Boolean);
        dirs.pop();
        for (const url of urls) {
            const src =
                    url.indexOf("http") === 0
                        ? url
                        : dirs.join("/") + "/" + url,
                { blob, ext } = await getBlobAndExt(src),
                fileName = getFileName(src, ext);
            await saveAsset({ src, blob, fileName, filePath });
            text = text.replaceAll(url, `/portfolio/c2c/resources/${fileName}`);
        }
        fs.writeFileSync(`${filePath}/resources/${fileName}`, text);
    } catch (err) {
        console.error(href);
        console.error(err);
    }
}

export { redirectImgTags, redirectLinkTags, saveAssets, saveStylesheets };
