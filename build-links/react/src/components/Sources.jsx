import { useEffect, useState } from "react";
import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../scripts/firebase.js";
import { formatDate, getSources } from "./App";
import Editor from "./Editor";

export default function Sources() {
    const [sources, setSources] = useState();

    useEffect(() => {
        const colRef = collection(db, "links"),
            unsubscribe = onSnapshot(colRef, (querySnapshot) => {
                const result = [],
                    getMs = (isoDate) => new Date(isoDate).getTime(),
                    dateSortDescend = (a, b) => getMs(b.date) - getMs(a.date);
                querySnapshot.forEach((doc) => {
                    result.push({ id: doc.id, ...doc.data() });
                });
                setSources(result.toSorted(dateSortDescend));
            });
        return unsubscribe;
    }, []);

    async function handleUpdateSources({ e, source }) {
        e.target.disabled = true;
        try {
            const result = getSources(source.id),
                docRef = doc(db, "links", source.id);
            console.log(result);
            if (Object.entries(result).length) {
                await setDoc(docRef, {
                    date: new Date().toISOString(),
                    links: result,
                });
                alert("Sources updated!");
            } else {
                await deleteDoc(docRef);
                alert("Entry deleted!");
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
            <h2>Sources</h2>
            <AddLink {...{ sources }} />
            <hr />
            <br />
            {sources?.map((source) => (
                <details>
                    <summary>{formatDate(source.date)}</summary>
                    <button onClick={(e) => handleUpdateSources({ e, source })}>
                        update sources
                    </button>
                    <div className={`category source-${source.id}`}>
                        <Editor links={source.links} sourceId={source.id} />
                    </div>
                </details>
            ))}
        </div>
    );
}

function AddLink({ sources }) {
    async function handleAddLink(e) {
        try {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target)),
                sourceId = e.target.source_id.value;
            console.log(data);
            if (sourceId === "NEW") {
                const colRef = collection(db, "links");
                await addDoc(colRef, {
                    links: [data],
                    date: new Date().toISOString(),
                });
            } else {
                const docRef = doc(db, "links", sourceId);
                await updateDoc(docRef, { links: arrayUnion(data) });
            }
            alert("Link added!");
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }
    return (
        <form onSubmit={handleAddLink}>
            <h3>Add Link</h3>
            <input type="url" name="link" placeholder="url..." required />
            <input type="text" name="title" placeholder="title..." required />
            <input type="datetime-local" name="date" required />
            <textarea name="notes" required></textarea>
            <select name="source_id">
                <option value="NEW">NEW SOURCE LINKS</option>
                {sources?.map((source) => (
                    <option value={source.id}>{formatDate(source.date)}</option>
                ))}
            </select>
            <nav>
                <button type="submit">add link</button>
            </nav>
        </form>
    );
}
