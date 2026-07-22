export default function TreeOfLife({
    highlight,
    showGroups,
    isKircher,
    kabbalahMajors,
}) {
    const letterGroups = {
            mother: ["aleph", "mem", "shin"],
            double: ["beth", "gimmel", "daleth", "kaph", "peh", "rosh", "tav"],
        },
        kircher = {
            aleph: "teth",
            beth: "vav",
            gimmel: "chet",
            daleth: "gimmel",
            heh: "aleph",
            vav: "beth",
            zayn: "koph",
            chet: "yod",
            teth: "heh",
            yod: "nun",
            kaph: "kaph",
            lamed: "rosh",
            mem: "peh",
            nun: "tzaddi",
            samekh: "ayin",
            ayin: "zayn",
            peh: "mem",
            tzaddi: "lamed",
            koph: "shin",
            rosh: "samekh",
            shin: "daleth",
            tav: "tav",
        },
        findGroup = (letter) =>
            Object.entries(letterGroups).find(([key, val]) =>
                val.includes(isKircher ? kircher[letter] : letter)
            )?.[0],
        h = (str) =>
            `${
                highlight &&
                (Array.isArray(highlight)
                    ? highlight.find((s) => s.toLowerCase() === str)
                    : highlight.toLowerCase() === str)
                    ? "highlight "
                    : showGroups && (findGroup(str) || "other")
            } ${str}`,
        getLetter = (hebrew) => {
            if (isKircher) {
                const { kabbalah: k } =
                    Object.values(kabbalahMajors).find(
                        ({ kabbalah }) => hebrew === kabbalah.letter.hebrew
                    ) || {};
                const result =
                    k &&
                    Object.values(kabbalahMajors).find(
                        ({ kabbalah }) =>
                            kabbalah.letter.name === kircher[k.letter.name]
                    )?.kabbalah.letter.hebrew;
                return result || hebrew;
            } else {
                return hebrew;
            }
        };
    return `
        <div class="tol${isKircher ? " kircher" : ""}">
            <div class="sef ${h("kether")} center">1</div>
            <div class="sef ${h("chokmah")} top-row right-side">2</div>
            <div class="sef ${h("binah")} top-row left-side">3</div>
            <div class="sef ${h("chesed")} middle-row right-side">4</div>
            <div class="sef ${h("geburah")} middle-row left-side">5</div>
            <div class="sef ${h("tiphareth")} center">6</div>
            <div class="sef ${h("netzach")} bottom-row right-side">7</div>
            <div class="sef ${h("hod")} bottom-row left-side">8</div>
            <div class="sef ${h("yesod")} center">9</div>
            <div class="sef ${h("malkuth")} center">10</div>

            <div class="path ${h("aleph")} horizontal">
                <span>${getLetter("א")}</span>
            </div>
            <div class="path ${h("beth")} vertical">
                <span>${getLetter("ב")}</span>
            </div>
            <div class="path ${h("gimmel")} vertical">
                <span>${getLetter("ג")}</span>
            </div>
            <div class="path ${h("daleth")} vertical middle">
                <span>${getLetter("ד")}</span>
            </div>
            <div class="path ${h("heh")} diag trans-left">
                <span>${getLetter("ה")}</span>
            </div>
            <div class="path ${h("vav")} diag trans-right">
                <span>${getLetter("ו")}</span>
            </div>
            <div class="path ${h("zayn")} extra-long-diag">
                <span>${getLetter("ז")}</span>
            </div>
            <div class="path ${h("chet")} diag trans-right">
                <span>${getLetter("ח")}</span>
            </div>
            <div class="path ${h("teth")} long-diag">
                <span>${getLetter("ט")}</span>
            </div>
            <div class="path ${h("yod")} diag trans-left">
                <span>${getLetter("י")}</span>
            </div>
            <div class="path ${h("kaph")} vertical">
                <span>${getLetter("כ")}</span>
            </div>
            <div class="path ${h("lamed")} diag trans-left">
                <span>${getLetter("ל")}</span>
            </div>
            <div class="path ${h("mem")} horizontal">
                <span>${getLetter("מ")}</span>
            </div>
            <div class="path ${h("nun")} diag trans-right">
                <span>${getLetter("נ")}</span>
            </div>
            <div class="path ${h("samekh")} diag trans-right">
                <span>${getLetter("ס")}</span>
            </div>
            <div class="path ${h("ayin")} long-diag">
                <span>${getLetter("ע")}</span>
            </div>
            <div class="path ${h("peh")} vertical">
                <span>${getLetter("פ")}</span>
            </div>
            <div class="path ${h("tzaddi")} diag trans-left">
                <span>${getLetter("צ")}</span>
            </div>
            <div class="path ${h("koph")} extra-long-diag">
                <span>${getLetter("ק")}</span>
            </div>
            <div class="path ${h("rosh")} vertical middle">
                <span>${getLetter("ר")}</span>
            </div>
            <div class="path ${h("shin")} horizontal">
                <span>${getLetter("ש")}</span>
            </div>
            <div class="path ${h("tav")} vertical middle">
                <span>${getLetter("ת")}</span>
            </div>
        </div>
    `;
}
