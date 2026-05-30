import { useEffect, useState } from "react";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
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
            const result = getSources(source.id);
            console.log(result);
            const docRef = doc(db, "links", source.id);
            if (Object.entries(result).length) {
                await setDoc(docRef, {
                    date: new Date().toISOString(),
                    categories: result,
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
            {sources?.map((source) => (
                <>
                    <details>
                        <summary>{formatDate(source.date)}</summary>
                        <button
                            onClick={(e) => handleUpdateSources({ e, source })}
                        >
                            update sources
                        </button>
                        {Object.entries(source.categories).map(
                            ([catId, cat]) => (
                                <div
                                    className={`category source-${source.id}`}
                                    data-category_id={catId}
                                    data-category_name={cat.category_name}
                                >
                                    <h4>{cat.category_name}</h4>
                                    <Editor links={cat.links} />
                                </div>
                            ),
                        )}
                    </details>
                    <hr />
                </>
            ))}
        </div>
    );
}
