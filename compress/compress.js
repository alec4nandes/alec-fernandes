const fs = require("fs"),
    path = require("path"),
    { glob } = require("glob"),
    sharp = require("sharp");

// LAST COMPRESS DATE: DEC 2, 2025

const inputDir = "../public/portfolio/c2c/resources", // source directory
    outputDir = inputDir;

glob(path.join(inputDir, "**", "*.{jpg,jpeg,png,webp}"), {})
    .then((files) => {
        // fs.mkdirSync(outputDir, { recursive: true });
        for (const inputFile of files) {
            const fileName = path.basename(inputFile),
                tmp = path.join(outputDir, `.tmp-${Date.now()}-${fileName}`),
                outputFilePath = path.join(outputDir, fileName);
            sharp(inputFile)
                .resize({
                    width: 800, // max width
                    height: 800, // max height
                    fit: "inside", // preserve aspect ratio, fit inside box
                    withoutEnlargement: true, // prevents upscaling smaller images
                })
                .jpeg({ quality: 80, progressive: true })
                .toFile(tmp, async (err, info) => {
                    if (err) {
                        console.error(`Error compressing ${inputFile}:`, err);
                    } else {
                        fs.rename(tmp, outputFilePath, () => {});
                        console.log(`Compressed ${inputFile}`);
                    }
                });
        }
    })
    .catch((err) => {
        console.error("Error finding files:", err);
        return;
    });
