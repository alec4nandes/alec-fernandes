export default function format({ original, revised }) {
    console.log(original, "\n-----\n", revised);
    const originalWords = original.split(" "),
        revisedWords = revised.split(" "),
        revisions = getRevisions({ originalWords, revisedWords }),
        formatted = formatRevisions({ originalWords, revisedWords, revisions });
    console.log(revisions);
    return formatted;
}

function getRevisions({ originalWords, revisedWords }) {
    const [longer] = [originalWords, revisedWords].sort(
            (a, b) => b.length - a.length
        ),
        maxIndex = longer.length,
        revisions = getRevisionsHelper({
            remainingOriginal: originalWords,
            remainingRevised: revisedWords,
            maxIndex,
        });
    return revisions;
}

/* 
    find the indexes where the words differ,
    then search each of the remaining words past that index for a match.
    then find the closest average distance of the matching words
    to the start of their arrays.
    then, of those two words closest to the beginning, find the
    one with the smallest absolute difference between each index.
    collect this data about the different words, their index positions,
    and the matching word and its index positions.
    recursively shorten the array
*/
function getRevisionsHelper({
    remainingOriginal,
    remainingRevised,
    maxIndex,
    revisions = [],
}) {
    for (let i = 0; i < maxIndex; i++) {
        const originalWord = remainingOriginal[i],
            revisedWord = remainingRevised[i];
        if (originalWord !== revisedWord) {
            // find the indexes of each remaining word in both arrays
            const nextO = [],
                nextR = [],
                start = i + 1;
            for (let x = start; x < maxIndex; x++) {
                const nextOWord = remainingOriginal[x],
                    nextRWord = remainingRevised[x],
                    slicedO = remainingOriginal.slice(start),
                    slicedR = remainingRevised.slice(start),
                    nextOIndex = slicedO.indexOf(nextRWord),
                    nextRIndex = slicedR.indexOf(nextOWord);
                nextOIndex !== -1 &&
                    nextO.push({
                        word: nextRWord,
                        // where this next revised word is
                        // in the remaining original array
                        originalIndex: nextOIndex + start,
                        // where this word is in the other array
                        revisedIndex: slicedR.indexOf(nextRWord) + start,
                    });
                nextRIndex !== -1 &&
                    nextR.push({
                        word: nextOWord,
                        // where this next original word is
                        // in the remaining revised array
                        revisedIndex: nextRIndex + start,
                        // where this word is in the other array
                        originalIndex: slicedO.indexOf(nextOWord) + start,
                    });
            }
            // find the word that's generally closest to the start
            // in each array
            const sortClosestToBeginning = (a, b) =>
                    a.originalIndex +
                    a.revisedIndex -
                    (b.originalIndex + b.revisedIndex),
                [closestO] = nextO.sort(sortClosestToBeginning),
                [closestR] = nextR.sort(sortClosestToBeginning),
                // then find smallest absolute difference in indexes
                // between the two closest finalists
                sortSmallestAbsDiff = (a, b) => {
                    const formula = ({ originalIndex, revisedIndex }) =>
                        Math.abs(originalIndex - revisedIndex);
                    return formula(a) - formula(b);
                },
                [winner] = [closestO, closestR].sort(sortSmallestAbsDiff);
            // if there's a valid winner, update the index info
            // to reflect the correct indexes in each whole array
            const lastO = revisions.at(-1)?.match.originalIndex || 0,
                lastR = revisions.at(-1)?.match.revisedIndex || 0,
                difference = {
                    original: {
                        word: originalWord,
                        index: i + lastO,
                    },
                    revised: {
                        word: revisedWord,
                        index: i + lastR,
                    },
                };
            if (winner) {
                const { originalIndex, revisedIndex } = winner,
                    result = {
                        match: {
                            word: winner.word,
                            originalIndex: originalIndex + lastO,
                            revisedIndex: revisedIndex + lastR,
                        },
                        difference,
                    };
                revisions.push(result);
                // slice the arrays so that they both start with the
                // same word in the next round of recursion
                remainingOriginal = remainingOriginal.slice(originalIndex);
                remainingRevised = remainingRevised.slice(revisedIndex);
                return getRevisionsHelper({
                    remainingOriginal,
                    remainingRevised,
                    maxIndex,
                    revisions,
                });
            } else {
                // if no valid winner, one or both of the remaining
                // arrays are exhausted or they've ended with a revision
                revisions.push({ difference });
                break;
            }
        }
    }
    return revisions;
}

function formatRevisions({ originalWords, revisedWords, revisions }) {
    if (!revisions.length) {
        alert("No revisions. Looks good!");
        return;
    }
    let formatted = "",
        oIndex = 0,
        rIndex = 0;
    for (const { match, difference } of revisions) {
        formatted +=
            " " +
            originalWords.slice(oIndex, difference.original.index).join(" ");
        oIndex = difference.original.index;
        rIndex = difference.revised.index;
        // no match means the text ends with a revision
        const originalPhrase = originalWords
                .slice(
                    ...(match
                        ? [oIndex, match.originalIndex]
                        : [difference.original.index])
                )
                .join(" "),
            revisedPhrase = revisedWords
                .slice(
                    ...(match
                        ? [rIndex, match.revisedIndex]
                        : [difference.revised.index])
                )
                .join(" ");
        formatted +=
            ` <span class="revision"><s>${originalPhrase}</s>` +
            `<b>${revisedPhrase}</b></span> `;
        oIndex = match?.originalIndex;
        rIndex = match?.revisedIndex;
    }
    const lastRevision = revisions.at(-1);
    return (
        formatted +
        (lastRevision.match
            ? originalWords.slice(lastRevision.match.originalIndex).join(" ")
            : "")
    ).replaceAll("\n", "<br>");
}
