import playwright from "playwright-core";
import chromium from "@sparticuz/chromium";

export const handler = async (event) => {
    const { url } = JSON.parse(event.body);
    return {
        statusCode: 200,
        body: await getUrl(url),
    };
};

async function getUrl(googleUrl) {
    const browser = await playwright.chromium.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        }),
        context = await browser.newContext(),
        page = await context.newPage();
    let url = googleUrl;
    try {
        await page.goto(googleUrl, { waitUntil: "domcontentloaded" });
        await page.waitForURL(/^((?!news\.google\.com).)*$/, {
            waitUntil: "domcontentloaded",
            timeout: 5_000,
        });
        url = page.url();
    } catch (err) {
        console.error(err);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
        return url;
    }
}
