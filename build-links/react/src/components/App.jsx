import "../css/App.css";
import { useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../scripts/firebase.js";
import AddCategory from "./AddCategory";
import News from "./News";
import Sources from "./Sources";

export default function App() {
    const [user, setUser] = useState(),
        [view, setView] = useState("news"),
        [categories, setCategories] = useState([]);

    useEffect(() => {
        const colRef = collection(db, "links_categories"),
            unsubscribe = onSnapshot(colRef, (querySnapshot) => {
                const result = [];
                querySnapshot.forEach((doc) => {
                    result.push({ id: doc.id, ...doc.data() });
                });
                setCategories(result);
            }),
            unsubAuth = onAuthStateChanged(auth, (userCred) => {
                setUser(userCred?.email);
            });
        return () => {
            unsubscribe();
            unsubAuth();
        };
    }, []);

    async function handleSignIn(e) {
        try {
            e.preventDefault();
            const email = e.target.email.value,
                pw = e.target.pw.value;
            await signInWithEmailAndPassword(auth, email, pw);
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    return (
        <>
            <h1>Blog Links</h1>
            {user ? (
                <div>
                    <nav>
                        <button onClick={() => signOut(auth)}>sign out</button>
                        {view !== "categories" && (
                            <button onClick={() => setView("categories")}>
                                categories
                            </button>
                        )}
                        {view !== "news" && (
                            <button onClick={() => setView("news")}>
                                get news
                            </button>
                        )}
                        {view !== "sources" && (
                            <button onClick={() => setView("sources")}>
                                sources
                            </button>
                        )}
                    </nav>

                    <hr />

                    {view === "categories" && (
                        <AddCategory {...{ categories }} />
                    )}
                    {view === "news" && <News {...{ categories }} />}
                    {view === "sources" && <Sources />}
                </div>
            ) : (
                <form id="sign-in" onSubmit={handleSignIn}>
                    <input type="email" name="email" placeholder="email..." />
                    <input
                        type="password"
                        name="pw"
                        placeholder="password..."
                    />
                    <button type="submit">sign in</button>
                </form>
            )}
        </>
    );
}

function formatDate(isoDate) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(isoDate));
}

function getSearchQuery(queries) {
    return queries
        .map(
            (group) =>
                `(${group
                    .split(",")
                    .map((term) => term.trim())
                    .join(" OR ")})`,
        )
        .join("");
}

function getSources(sourceId) {
    const className = sourceId ? `.source-${sourceId}` : "";
    console.log(className);
    return [...document.querySelectorAll(`.category${className}`)].reduce(
        (acc, curr) => {
            const catId = curr.dataset.category_id,
                catName = curr.dataset.category_name,
                links = [...curr.querySelectorAll("form.link-notes")]
                    .filter((elem) => elem.notes.value.trim())
                    .map((elem) => ({
                        ...elem.dataset,
                        notes: elem.notes.value.trim(),
                    }));
            return links.length
                ? {
                      ...acc,
                      [catId]: { category_name: catName, links },
                  }
                : acc;
        },
        {},
    );
}

export { formatDate, getSearchQuery, getSources };
