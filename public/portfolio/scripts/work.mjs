const csv = `
7/13/24,Strange Rings Over Berlin Stir Up Rumors of Aliens,https://www.coasttocoastam.com/article/watch-strange-rings-over-berlin-stir-up-rumors-of-aliens/,Article,YES
7/13/24,The UFO Paradox / Overcoming Cancer,https://www.coasttocoastam.com/show/2024-07-13-show/,Recap,YES
7/12/24,Soulmates & Angels / Open Lines,https://www.coasttocoastam.com/show/2024-07-12-show/,Recap,YES
7/7/24,Manifestation & Transformation / Energy of the Cosmos,https://www.coasttocoastam.com/show/2024-07-07-show/,Recap,YES
6/30/24,Two Psychic Animals Pick Winning Soccer Team,https://www.coasttocoastam.com/article/two-psychic-animals-correctly-identify-winning-soccer-team/,Article,YES
6/30/24,True Crime Cases / Emergency Room Spirits,https://www.coasttocoastam.com/show/2024-06-30-show/,Recap,YES
6/28/24,Arizona UFOs / Open Lines,https://www.coasttocoastam.com/show/2024-06-28-show/,Recap,YES
6/16/24,Sci-Fi and AI / Women Crime Bosses,https://www.coasttocoastam.com/show/2024-06-16-show/,Recap,YES
6/13/24,Alien Encounters / Dark Entities,https://www.coasttocoastam.com/show/2024-06-13-show/,Recap,YES
6/12/24,Astrology Forecast / Other Side Communications,https://www.coasttocoastam.com/show/2024-06-12-show/,Recap,YES
6/9/24,Star's Mysterious Signal Surprises Scientists,https://www.coasttocoastam.com/article/stars-mysterious-signal-surprises-scientists/,Article,YES
6/9/24,Legacy of Karloff / Remote Viewing Horse Races,https://www.coasttocoastam.com/show/2024-06-09-show/,Recap,YES
`;

const work = csv
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
        const [date, title, url, type] = line.split(","),
            fileName = url.split("/").filter(Boolean).at(-1);
        return { date, title, url, type, fileName };
    });

export { work };
