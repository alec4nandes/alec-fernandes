import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../scripts/firebase.js";
import { formatDate, getSources } from "./App";

export default function Editor({ links, sourceId }) {
    function Item({ link, i }) {
        const [url, setUrl] = useState(link.link);

        async function handleGetSummary({ e, link }) {
            const submitter = e.nativeEvent.submitter;
            try {
                e.preventDefault();
                submitter.disabled = true;
                if (submitter.value === "metadata") {
                    const endpoint =
                            "https://zzzqjbtboqlphhhulu6a2kanse0ajemv.lambda-url.us-east-2.on.aws/",
                        resp = await fetch(endpoint, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: link.link }),
                        });
                    if (resp.ok) {
                        const realUrl = await resp.text();
                        console.log(realUrl);
                        setUrl(realUrl);
                    }
                } else if (submitter.value === "summary") {
                    const input = `HEADLINE: ${link.title}\nURL:${url}`,
                        endpoint =
                            // "http://localhost:5001/alec-fernandes/us-central1/summary",
                            "https://summary-o5yypoiiya-uc.a.run.app",
                        data = await fetch(endpoint, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ input }),
                        }).then((resp) => resp.json());
                    console.log(data);
                    e.target.notes.value = data.result.trim();
                }
            } catch (err) {
                console.error(err);
                alert(err);
            } finally {
                submitter.disabled = false;
            }
        }

        async function handleMove(i, increm) {
            const sourceLinks = getSources(sourceId),
                index = i + increm;
            if (index < 0 || index >= sourceLinks.length) {
                alert("Outside bounds!");
                return;
            }
            const holder = sourceLinks[index];
            sourceLinks[index] = sourceLinks[i];
            sourceLinks[i] = holder;
            try {
                const docRef = doc(db, "links", sourceId);
                console.log(sourceLinks);
                await updateDoc(docRef, { links: sourceLinks });
            } catch (err) {
                console.error(err);
                alert(err);
            }
        }

        return (
            <li key={link.title}>
                <a href={link.link} target="_blank">
                    {link.title}
                </a>
                <br />
                <small>
                    {formatDate(link.isoDate || link.date)}
                    {link.category_id && link.category_name && (
                        <em>
                            {" "}
                            / {link.category_name} ({link.category_id})
                        </em>
                    )}
                </small>
                {sourceId && (
                    <>
                        <br />
                        <nav>
                            <button onClick={() => handleMove(i, -1)}>
                                move up
                            </button>
                            <button onClick={() => handleMove(i, +1)}>
                                move down
                            </button>
                        </nav>
                    </>
                )}
                <details>
                    <summary>notes</summary>
                    <form
                        className="link-notes"
                        data-link={url}
                        data-title={link.title}
                        data-date={link.isoDate || link.date}
                        data-category-id={link.category_id}
                        data-category-name={link.category_name}
                        onSubmit={(e) => handleGetSummary({ e, link })}
                    >
                        <textarea
                            name="notes"
                            defaultValue={link.notes || ""}
                        ></textarea>
                        {url.includes("news.google.com") ? (
                            <button type="submit" value="metadata">
                                get metadata
                            </button>
                        ) : (
                            <button type="submit" value="summary">
                                get summary
                            </button>
                        )}
                    </form>
                </details>
            </li>
        );
    }

    return links?.length ? (
        <ul>
            {links.map((link, i) => (
                <Item {...{ link, i }} />
            ))}
        </ul>
    ) : (
        links && (
            <p>
                <em>No stories within timeframe!</em>
            </p>
        )
    );
}
