const { chromium } = require("playwright"),
    fs = require("fs-extra"),
    slugify = require("slugify"),
    { articles, shows } = require("./work.json"),
    { downloadImages, saveImage } = require("./images.js"),
    { removeElems } = require("./remove.js");
const { cafe } = require("./cafe.js");

const MAX_CONCURRENT = 5,
    NETWORK_TIMEOUT = 10_000,
    CLICK_TIMEOUT = 1_000,
    BASE_DIR = "portfolio/c2c",
    resourcesDir = `${BASE_DIR}/resources`;

// TODO: detect new entries on future compiles

main();

async function main() {
    await fs.ensureDir(resourcesDir);
    const articleUrl = "https://www.coasttocoastam.com/article/",
        showUrl = "https://www.coasttocoastam.com/show/",
        promises = Object.entries({
            article: Object.keys(articles),
            show: Object.keys(shows),
        })
            .map(([type, slugs]) => slugs.map((slug) => [type, slug]))
            .flat()
            .map(([type, slug]) => async () => {
                const outputDir = `${BASE_DIR}/${type}`;
                await fs.ensureDir(outputDir);
                if (type === "show") {
                    slug += "-show";
                }
                const url = (type === "article" ? articleUrl : showUrl) + slug;
                await savePage({ url, slug, outputDir });
            });
    /* await */ cafe(promises, MAX_CONCURRENT);
}

async function savePage({ url, slug, outputDir }) {
    const browser = await chromium.launch({ headless: false }),
        page = await browser.newPage(),
        styleEntries = [];

    saveStylesheets(page, styleEntries);

    try {
        // Navigate to the page
        await page.goto(url, {
            waitUntil: "networkidle",
            timeout: NETWORK_TIMEOUT,
        });
    } catch (err) {
        console.error("timeout for:", url);
    }

    // Open Bumper Music list
    if (await page.locator(".bumper-music").count()) {
        try {
            await page.click(".bumper-music button", {
                timeout: CLICK_TIMEOUT,
            });
        } catch (err) {
            console.error("ERROR:", err.message);
        }
    }

    await removeElems(page);

    // Hide popups / cookie banners / overlays
    await page.addStyleTag({
        content: `
            [id*="cookie"], [class*="cookie"],
            [id*="consent"], [class*="consent"],
            [class*="modal"], [role="dialog"],
            .overlay, .backdrop, .popup,
            .nav-toggler, .navbar-footer, .search-user-container,
            .component-recommendation, .bumper-music button,
            .coast-show-audiobox-component,
            [id*="google_ads"],
            .audiobox-section, .shareIOS-icon,
            #goog-gt-tt
            {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        `,
    });

    await downloadImages(page, resourcesDir);
    await saveHTML({ page, styleEntries, outputDir, slug });
    await browser.close();
}

function saveStylesheets(page, entries) {
    page.on("response", async (response) => {
        if (response.request().resourceType() === "stylesheet") {
            const url = response.url();
            if (!url.includes("fonts.googleapis.com")) {
                const dirs = url.split("/").filter(Boolean);
                dirs.pop();
                const fileName = slugify(url),
                    filePath = `${resourcesDir}/${fileName}`;
                let text = await response.text();
                // find url('') inside stylesheets,
                // save media and replace path:
                const matches =
                    text
                        .match(/url\((.+?)\)/g)
                        ?.map((m) => m.match(/url\((.+?)\)/)[1]) || [];
                for (const match of matches) {
                    const src =
                            match.indexOf("http") === 0
                                ? match
                                : dirs.join("/") + "/" + match,
                        filePath = await saveImage(src, resourcesDir);
                    text = text.replaceAll(match, "/" + filePath);
                }
                entries.push([url, filePath]);
                fs.writeFileSync(filePath, text);
            }
        }
    });
}

async function saveHTML({ page, styleEntries, outputDir, slug }) {
    let html = (await page.content()).replaceAll("&amp;", "&");
    for (const [url, filePath] of styleEntries) {
        const key = url.trim().split("/").at(-1),
            keyIndex = html.indexOf(key);
        if (keyIndex !== -1) {
            const upTo = html.slice(0, keyIndex),
                httpIndex = upTo.lastIndexOf("http");
            html =
                html.slice(0, httpIndex) +
                "/" +
                filePath +
                html.slice(keyIndex + key.length);
        }
    }
    await fs.ensureDir(`${outputDir}/${slug}`);
    fs.writeFileSync(`${outputDir}/${slug}/index.html`, html, "utf8");
    console.log(`Saved: ${slug}`);
}

// Example (size = 3) → [ [1,2,3], [4,5,6], [7] ]
function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}
