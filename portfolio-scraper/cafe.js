/* INFO:
"Cafe" limits the number of concurrent API calls in the most efficient way.
There's limited "tables" (threads), but when one "reservation" (Promise) finishes,
another reservation sits down at that table, creating a new Promise.
Each table eats at its own pace, but as soon as one Promise ends,
another Promise can begin at that table.
*/

/* TESTING:
const promises = Array.from({ length: 50 }, () => guest);
async function guest() {
    const time = ~~(Math.random() * 1000);
    return await new Promise((resolve) =>
        setTimeout(() => resolve(time), time)
    );
}
cafe(promises);
*/

// TODO: add JSDoc to funcs

// NOTE: reservations must be a list of untriggered promises.
// ex: () => { () => new Promise() }

async function cafe(reservations, maxTables = 10, promiseParams = []) {
    const promises = [],
        max = reservations.length < maxTables ? reservations.length : maxTables;
    for (let num = 1; num <= max; num++) {
        // num = table #
        promises.push(seatTable(reservations, num, promiseParams));
    }
    return (await Promise.all(promises)).flat();
}

async function seatTable(reservations, num, promiseParams) {
    let count = 0;
    const result = [];
    while (reservations.length) {
        result.push(await reservations.shift()(...promiseParams));
        console.log(
            `table ${num} (orders: ${++count}) / ` +
                `orders left: ${reservations.length}`
        );
    }
    return result;
}

module.exports = { cafe };
