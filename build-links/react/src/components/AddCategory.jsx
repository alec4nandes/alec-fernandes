import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../scripts/firebase.js";
import { getSearchQuery } from "./App";

export default function AddCategory({ categories }) {
    const [edit, setEdit] = useState(),
        [groups, setGroups] = useState(1);

    useEffect(() => {
        setGroups(edit?.queries.length || 1);
    }, [edit]);

    async function handleAddCategory(e) {
        e.preventDefault();
        const submitter = e.nativeEvent.submitter;
        if (submitter.value === "add group") {
            setGroups((g) => ++g);
            return;
        } else if (submitter.value === "reset") {
            e.target.reset();
            setEdit();
            return;
        }
        const formData = new FormData(e.target),
            name = formData.get("category_name").trim();
        if (!name) {
            alert("Category name is required!");
            return;
        }
        const queries = formData
            .getAll("groups[]")
            .map((str) =>
                str
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            )
            .filter(({ length }) => length);
        if (!queries.length) {
            alert("Must include at least one search term!");
            return;
        }
        try {
            const data = {
                category_name: name,
                queries: queries.map((q) => q.join(", ")),
            };
            if (submitter.value === "add category") {
                const colRef = collection(db, "links_categories");
                await addDoc(colRef, data);
            } else if (submitter.value === "edit category") {
                const docRef = doc(db, "links_categories", edit.id);
                await setDoc(docRef, data);
            }
            alert("Category added!");
            setEdit();
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    async function handleDeleteCategory(cat) {
        try {
            if (confirm("Delete category?")) {
                const docRef = doc(db, "links_categories", cat.id);
                await deleteDoc(docRef);
                alert("Category deleted!");
            }
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    return (
        <div>
            <h2>Categories</h2>
            <form key={edit?.id} id="add-category" onSubmit={handleAddCategory}>
                <label htmlFor="category-name">category name</label>
                <input
                    id="category-name"
                    type="text"
                    name="category_name"
                    defaultValue={edit?.category_name}
                ></input>
                <label>
                    query goups{" "}
                    <button type="submit" value="add group">
                        +
                    </button>
                </label>
                {Array.from({ length: groups }, (_, i) => (
                    <input
                        key={`group-${i + 1}`}
                        name="groups[]"
                        placeholder="comma-separated..."
                        defaultValue={edit?.queries[i]}
                    />
                ))}
                {edit && (
                    <button type="submit" value="edit category">
                        edit category
                    </button>
                )}
                <button type="submit" value="add category">
                    add category
                </button>
                <button type="submit" value="reset">
                    reset
                </button>
            </form>

            <hr />

            <ul>
                {categories.map((cat) => (
                    <li>
                        <strong>{cat.category_name}:</strong>{" "}
                        {getSearchQuery(cat.queries)}
                        <br />
                        <nav>
                            <button onClick={() => setEdit(cat)}>edit</button>
                            <button onClick={() => handleDeleteCategory(cat)}>
                                delete
                            </button>
                        </nav>
                    </li>
                ))}
            </ul>
        </div>
    );
}
