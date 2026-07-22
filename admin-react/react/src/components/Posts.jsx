import { useEffect, useRef, useState } from "react";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import { db } from "../scripts/firebase.js";
import { formatDate } from "./App.jsx";

export default function Posts() {
    const [posts, setPosts] = useState(),
        [post, setPost] = useState(),
        formRef = useRef();

    useEffect(() => {
        const colRef = collection(db, "posts"),
            unsubscribe = onSnapshot(colRef, (querySnapshot) => {
                const result = [];
                querySnapshot.forEach((doc) => {
                    result.push({ id: doc.id, ...doc.data() });
                });
                setPosts(result.sort(sortDateDescending));
            });
        return unsubscribe;

        function sortDateDescending(a, b) {
            const getMs = (date) => new Date(date).getTime();
            return getMs(b.date) - getMs(a.date);
        }
    }, []);

    async function handleEditPost(e) {
        try {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target)),
                docRef = doc(db, "posts", data.post_id),
                splitter = (str) => str.split(",").map((s) => s.trim());
            data.categories = splitter(data.categories);
            data.tags = splitter(data.tags);
            data.date = new Date(data.date).toISOString();
            await setDoc(docRef, data);
            alert(`Post ${post.id ? "edited" : "added"}!`);
            setPost();
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    async function handleDeletePost() {
        try {
            if (confirm("Delete post?")) {
                const docRef = doc(db, "posts", post.id);
                await deleteDoc(docRef);
                alert("Post deleted!");
                setPost();
            }
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    function handleSlugifyTitle(e) {
        e.preventDefault();
        formRef.current.post_id.value = formRef.current.title.value
            .toLowerCase()
            .trim()
            .normalize("NFD") // Splits accented characters into their base letters and diacritics
            .replace(/[\u0300-\u036f]/g, "") // Removes the diacritics (accents)
            .replace(/[^a-z0-9\s-]/g, "") // Removes anything that isn't a letter, number, space, or hyphen
            .replace(/[\s_]+/g, "-") // Replaces spaces and underscores with a single hyphen
            .replace(/^-+|-+$/g, ""); // Trims trailing or leading hyphens
    }

    function handleFormatCaption(e) {
        e.preventDefault();
        const captionElem = formRef.current.feature_image_caption,
            caption = captionElem.value,
            formatted = caption.trim().replaceAll("<a ", `<a target="_blank" `);
        captionElem.value = formatted;
    }

    function toDatetimeLocal(isoString) {
        const date = isoString ? new Date(isoString) : new Date(),
            pad = (n) => String(n).padStart(2, "0");
        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            "T" +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes())
        );
    }

    return (
        <div>
            <h1>Posts</h1>
            {post ? (
                <>
                    <form ref={formRef} onSubmit={handleEditPost}>
                        <h2>Edit Post</h2>
                        <label htmlFor="post-id">post id:</label>
                        <input
                            id="post-id"
                            name="post_id"
                            defaultValue={post.id}
                            required
                        />
                        <nav>
                            <button onClick={handleSlugifyTitle}>
                                slugify title for ID
                            </button>
                        </nav>
                        <label htmlFor="title">title:</label>
                        <input
                            id="title"
                            name="title"
                            defaultValue={post.title}
                            required
                        />
                        <label htmlFor="subtitle">subtitle:</label>
                        <input
                            id="subtitle"
                            defaultValue={post.subtitle}
                            name="subtitle"
                        />
                        <label htmlFor="content">content:</label>
                        <textarea
                            id="content"
                            name="content"
                            defaultValue={post.content}
                            required
                        ></textarea>
                        <label htmlFor="feature-image">
                            feature image path:
                        </label>
                        <input
                            id="feature-image"
                            name="feature_image"
                            defaultValue={post.feature_image}
                        />
                        <label htmlFor="feature-image-caption">
                            feature image caption:
                        </label>
                        <input
                            id="feature-image-caption"
                            name="feature_image_caption"
                            defaultValue={post.feature_image_caption}
                        />
                        <nav>
                            <button onClick={handleFormatCaption}>
                                format caption
                            </button>
                        </nav>
                        <label htmlFor="feature-image-alt">
                            feature image alt:
                        </label>
                        <input
                            id="feature-image-alt"
                            name="feature_image_alt"
                            defaultValue={post.feature_image_alt}
                        />
                        <label htmlFor="categories">categories:</label>
                        <input
                            id="categories"
                            name="categories"
                            defaultValue={post.categories}
                            required
                        />
                        <label htmlFor="tags">tags:</label>
                        <input id="tags" name="tags" defaultValue={post.tags} />
                        <label htmlFor="date">date:</label>
                        <input
                            id="date"
                            type="datetime-local"
                            name="date"
                            defaultValue={toDatetimeLocal(post.date)}
                        />
                        <nav>
                            <label>
                                <input
                                    type="checkbox"
                                    name="is_draft"
                                    defaultChecked={post.is_draft}
                                />
                                draft
                            </label>
                            <button type="submit">
                                {post.id ? "update" : "add post"}
                            </button>
                        </nav>
                    </form>
                    <br />
                    <br />
                    <nav>
                        {post.id && (
                            <button onClick={handleDeletePost}>delete</button>
                        )}
                        <button onClick={() => setPost()}>back</button>
                    </nav>
                </>
            ) : (
                <>
                    <nav>
                        <button onClick={() => setPost({ post_id: "" })}>
                            new post
                        </button>
                    </nav>
                    <ul id="posts">
                        {posts?.map((post) => (
                            <li>
                                <button onClick={() => setPost(post)}>
                                    {post.title}
                                </button>
                                <br />
                                <small>{formatDate(post.date)}</small>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
