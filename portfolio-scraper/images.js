const sharp = require("sharp"),
    slugify = require("slugify");

async function downloadImages(page, resourcesDir) {
    const images = await page.$$("img");
    for (const img of images) {
        const src = await getSrc(img),
            filePath = await saveImage(src, resourcesDir);
        await img.evaluate((i, newSrc) => {
            i.src = "/" + newSrc;
            i.srcset = "";
            i.dataset.src = "";
            i.dataset.srcset = "";
        }, filePath);
    }
}

async function saveImage(src, resourcesDir) {
    if (!src) {
        console.error("ERROR: No src provided to saveImage()");
        return;
    }
    const noQueries = src.split("?")[0],
        blob = await fetch(src)
            .then((resp) => resp.blob())
            .catch((err) => {
                console.error(err.message);
                return null;
            });
    if (!blob) {
        return;
    }
    const imageBuffer = await blob.arrayBuffer(),
        ext = blob.type
            .slice(blob.type.indexOf("/") + 1)
            .split("+")[0]
            .trim()
            .toLowerCase(),
        fileType = ext === "png" ? "png" : "jpeg",
        fileName = `/${slugify(noQueries)}.${fileType}`,
        filePath = resourcesDir + fileName;
    await resizeAndSaveImage(imageBuffer, filePath, fileType);
    return filePath;
}

async function getSrc(img) {
    const srcset = await img.getAttribute("data-srcset");
    if (srcset) {
        return "http" + srcset.split("http").at(-1).split(" ")[0];
    }
    return await img.getAttribute("src");
}

async function resizeAndSaveImage(imageBuffer, outputFilePath, fileType) {
    // always resolve to keep things flowing
    await new Promise((resolve, reject) => {
        try {
            sharp(imageBuffer)
                .resize({
                    width: 800, // max width
                    height: 800, // max height
                    fit: "inside", // preserve aspect ratio, fit inside box
                    withoutEnlargement: true, // prevents upscaling smaller images
                })
                // .png() or .jpeg()
                [fileType]({ quality: 80, progressive: true })
                .toFile(outputFilePath, async (err, info) => {
                    if (err) {
                        console.error(
                            `Error saving to ${outputFilePath}:`,
                            err.message
                        );
                        resolve();
                    } else {
                        console.log(`Saved to ${outputFilePath}`);
                        resolve();
                    }
                });
        } catch (err) {
            console.error(`Error saving to ${outputFilePath}:`, err.message);
            resolve();
        }
    });
}

module.exports = { downloadImages, saveImage };
