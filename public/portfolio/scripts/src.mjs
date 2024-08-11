async function getSrc(imgElem) {
    const attrs = getSrcAttributes(imgElem),
        promises = Object.values(attrs)
            .filter(Boolean)
            .map((url) => fetch(url)),
        filled = await Promise.all(promises),
        // the bad ones are what we want.
        // remove search params and fetch again
        responses = filled.filter(({ ok }) => !ok),
        urlPromises = (responses.length ? responses : filled).map(
            async (resp) => {
                const url = removeSearchQuery(resp.url),
                    size = await getSize(await fetch(url));
                return [url, size];
            }
        ),
        urls = await Promise.all(urlPromises),
        [smallest] = urls.sort(sortSize)[0];
    return { all: attrs, smallest };
}

function getSrcAttributes(imgElem) {
    const { src, srcset, dataset } = imgElem,
        { src: dataSrc, srcset: dataSrcset } = dataset;
    return { src, srcset, dataSrc, dataSrcset };
}

function removeSearchQuery(url) {
    const ops = new URL(url).searchParams.get("ops");
    return (
        url.split("?")[0] + (ops && !ops.includes("http") ? `?ops=${ops}` : "")
    );
}

async function getSize(resp) {
    const { length } = await resp.text();
    return length;
}

function sortSize(a, b) {
    const [urlA, sizeA] = a,
        [urlB, sizeB] = b;
    return sizeA - sizeB || urlA.length - urlB.length;
}

export { getSrc };
