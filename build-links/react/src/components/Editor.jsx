import { useState } from "react";
import { formatDate } from "./App";

export default function Editor({ links }) {
    function Item({ link }) {
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
                            "http://localhost:5001/alec-fernandes/us-central1/summary",
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

        return (
            <li key={link.title}>
                <a href={link.link} target="_blank">
                    {link.title}
                </a>
                <br />
                <small>{formatDate(link.isoDate || link.date)}</small>
                <details>
                    <summary>notes</summary>
                    <form
                        className="link-notes"
                        data-link={url}
                        data-title={link.title}
                        data-date={link.isoDate || link.date}
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
            {links.map((link) => (
                <Item {...{ link }} />
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
