const lune = require("lune");

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getMoonSunTidesData(req, res) {
    const { latitude, longitude, date, time } = req.query,
        sending =
            !isNaN(latitude) && !isNaN(longitude)
                ? await handleLocalData(
                      { latitude: +latitude, longitude: +longitude },
                      date,
                      time
                  )
                : { error_message: "invalid coordinates" };
    res.send(sending);
}

function formatToday() {
    const d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate();
    return `${year}-${month}-${day}`;
}

async function handleLocalData(coords, date, time) {
    const moon = getMoonData(
            date ? new Date(`${date} ${time || ""}`) : new Date()
        ),
        d = date || formatToday(),
        { latitude, longitude } = coords,
        stations = await getNOAAStations(),
        nearestStation = findNearestStation({
            stations,
            latitude,
            longitude,
        });
    return {
        time: (date
            ? new Date(`${date} ${time || ""}`)
            : new Date()
        ).toUTCString(),
        coords,
        moon,
        nearest_NOAA_station: {
            name: nearestStation.name,
            id: +nearestStation.id,
            latitude: nearestStation.lat,
            longitude: nearestStation.lng,
        },
        tides: await getTidesData(nearestStation, d),
        solar: await getSolarData({ latitude, longitude }, d),
    };
}

function getMoonData(date) {
    let phases = lune.phase_hunt(date);
    const phase = lune.phase(date),
        newMoon = new Date(phases.new_date),
        nextNewMoon = new Date(phases.nextnew_date),
        fullMoon = new Date(phases.full_date),
        result = {
            phase,
            nextNewMoon: newMoon > date ? newMoon : nextNewMoon,
        };
    if (fullMoon > date) {
        const data = { ...result, nextFullMoon: fullMoon };
        return processMoonData(data);
    }
    const dayAfterNew = new Date(
        nextNewMoon.getFullYear(),
        nextNewMoon.getMonth(),
        nextNewMoon.getDate() + 1
    );
    phases = lune.phase_hunt(dayAfterNew);
    const data = { ...result, nextFullMoon: phases.full_date };
    return processMoonData(data);
}

function processMoonData(data) {
    const { illuminated } = data.phase,
        { nextFullMoon, nextNewMoon } = data,
        status = data.nextNewMoon < data.nextFullMoon ? "waning" : "waxing",
        parseResult = (dateTime) => new Date(dateTime).toUTCString();
    return {
        next_full_moon: parseResult(nextFullMoon),
        next_new_moon: parseResult(nextNewMoon),
        percent_illuminated: illuminated * 100,
        status,
    };
}

async function getNOAAStations() {
    const response = await fetch(
            "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json"
        ),
        { stations } = await response.json();
    return stations;
}

function findNearestStation({ stations, latitude, longitude }) {
    let shortestDistance, nearestStation;
    stations
        // only check tidal stations
        .filter((station) => station.tidal)
        .forEach((station) => {
            const { lat, lng } = station,
                // pythag theorem (distance is hypotenuse)
                trigDist = Math.sqrt(
                    Math.abs(latitude - lat) ** 2 +
                        Math.abs(longitude - lng) ** 2
                );
            if (
                // could be set to zero if standing on exact coordinate
                // of NOAA station
                (!shortestDistance && shortestDistance !== 0) ||
                trigDist < shortestDistance
            ) {
                shortestDistance = trigDist;
                nearestStation = station;
            }
        });
    return nearestStation;
}

async function getTidesData(nearestStation, date) {
    // scanning from yesterday to tomorrow to avoid any timezone issues
    const parsedDate = date
            .split("-")
            .map((str, i) => (i ? str.padStart(2, "0") : str))
            .join(""),
        url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${parsedDate}&range=48&product=predictions&datum=mllw&interval=hilo&format=json&units=metric&time_zone=gmt&station=${nearestStation.id}`,
        response = await fetch(url),
        tides = await response.json(),
        // UTC conversion not needed with time_zone=gmt parameter
        // offset = getTimezoneOffsetFromCoordinates({ latitude, longitude }),
        parseTides = (type) =>
            tides.predictions
                .filter((tide) => tide.type === type)
                .slice(0, 2)
                // .map((tide) => makeUTCString(tide.t, offset));
                .map((tide) => new Date(tide.t + ":00 GMT").toUTCString());
    return {
        high_tides: parseTides("H"),
        low_tides: parseTides("L"),
    };
}

// function getTimezoneOffsetFromCoordinates({ latitude, longitude }) {
//     const timeZone = find(latitude, longitude),
//         local = new Date().toLocaleString("en-US", {
//             timeZone,
//         }),
//         msDifference = new Date(local) - new Date(),
//         secondsDifference = msDifference / 1000,
//         hoursDifference = secondsDifference / 60 / 60;
//     return ~~hoursDifference;
// }

// function makeUTCString(localTime, offset) {
//     return new Date(
//         `${localTime} GMT${offset && offset < 0 ? "-" : "+"}${
//             offset ? Math.abs(offset) : 0
//         }`
//     ).toUTCString();
// }

async function getSolarData({ latitude, longitude }, date) {
    const response = await fetch(
            `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`
        ),
        { results } = await response.json(),
        { sunrise, sunset, solar_noon, day_length } = results,
        parseResult = (dateTime) => new Date(dateTime).toUTCString();
    return {
        sunrise: parseResult(sunrise),
        sunset: parseResult(sunset),
        solar_noon: parseResult(solar_noon),
        day_length,
    };
}

module.exports = { getMoonSunTidesData };
