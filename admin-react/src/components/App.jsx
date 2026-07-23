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
import Posts from "./Posts";

export default function App() {
    const [isLoaded, setIsLoaded] = useState(false),
        [user, setUser] = useState(),
        [view, setView] = useState("posts"),
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
                !isLoaded && setIsLoaded(true);
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
        isLoaded &&
        (user ? (
            <div>
                <nav>
                    <button onClick={() => signOut(auth)}>sign out</button>
                    {view !== "posts" && (
                        <button onClick={() => setView("posts")}>posts</button>
                    )}
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

                {view === "posts" ? (
                    <Posts />
                ) : (
                    <div>
                        <h1>Blog Links</h1>
                        {view === "categories" && (
                            <AddCategory {...{ categories }} />
                        )}
                        {view === "news" && <News {...{ categories }} />}
                        {view === "sources" && <Sources />}
                    </div>
                )}
            </div>
        ) : (
            <form id="sign-in" onSubmit={handleSignIn}>
                <h1>Sign In</h1>
                <input type="email" name="email" placeholder="email..." />
                <input type="password" name="pw" placeholder="password..." />
                <button type="submit">sign in</button>
            </form>
        ))
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
    return [...document.querySelectorAll(`.category${className}`)]
        .map((curr) =>
            [...curr.querySelectorAll("form.link-notes")]
                .filter((elem) => elem.notes.value.trim())
                .map((elem) => {
                    const { categoryId, categoryName, ...data } = elem.dataset;
                    return {
                        ...data,
                        notes: elem.notes.value.trim(),
                        ...(categoryId && categoryName
                            ? {
                                  category_id: categoryId,
                                  category_name: categoryName,
                              }
                            : {}),
                    };
                }),
        )
        .flat(Infinity);
}

export { formatDate, getSearchQuery, getSources };
