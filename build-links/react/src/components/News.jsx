import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../scripts/firebase.js";
import { getSearchQuery, getSources } from "./App";
import Editor from "./Editor";

export default function News({ categories }) {
    const units = { [1 / 24]: "hours", 1: "days", 7: "weeks" },
        [timeframe, setTimeframe] = useState({ interval: 1, unit: 1 }),
        [links, setLinks] = useState({});

    function handleTimeframe(e) {
        e.preventDefault();
        const interval = +e.target.form.interval.value,
            unit = +e.target.form.unit.value;
        setTimeframe({ interval, unit });
    }

    async function handleGetNews({ e, cat }) {
        e.target.disabled = true;
        try {
            const endpoint =
                    "http://localhost:5001/alec-fernandes/us-central1/news",
                query = getSearchQuery(cat.queries),
                dayMs = 1_000 * 60 * 60 * 24,
                ms = dayMs * timeframe.unit * timeframe.interval,
                links = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, timeframe_ms: ms }),
                }).then((resp) => resp.json());
            setLinks((data) => ({ ...data, [cat.id]: links }));
        } catch (err) {
            console.error(err);
            alert(err);
        } finally {
            e.target.disabled = false;
        }
    }

    async function handleSaveLinks(e) {
        e.target.disabled = true;
        try {
            const result = getSources();
            console.log(result);
            if (Object.entries(result).length) {
                const colRef = collection(db, "links");
                await addDoc(colRef, {
                    date: new Date().toISOString(),
                    categories: result,
                });
                alert("Links added to database!");
            } else {
                alert("No links have notes to add!");
            }
        } catch (err) {
            console.error(err);
            alert(err);
        } finally {
            e.target.disabled = false;
        }
    }

    return (
        <div>
            <h2>Get News</h2>
            <nav>
                <form onChange={handleTimeframe}>
                    <nav>
                        <input
                            type="number"
                            name="interval"
                            min={1}
                            defaultValue={timeframe.interval}
                        />
                        <select name="unit" defaultValue={timeframe.unit}>
                            {Object.entries(units).map(([key, value]) => (
                                <option value={key}>{value}</option>
                            ))}
                        </select>
                    </nav>
                </form>

                <button onClick={handleSaveLinks}>save links</button>
            </nav>

            <hr />

            {categories.map((cat) => (
                <div
                    className="category"
                    data-category_id={cat.id}
                    data-category_name={cat.category_name}
                >
                    <button onClick={(e) => handleGetNews({ e, cat })}>
                        {cat.category_name}
                    </button>
                    <Editor links={links[cat.id]} />
                </div>
            ))}
        </div>
    );
}
