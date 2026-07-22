import "../css/App.css";
import { useEffect, useRef, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "../scripts/firebase.js";
import { endpoints } from "../scripts/endpoints.js";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

const renderer = {
    link(token) {
        const href = token.href,
            title = token.title ? `title="${token.title}"` : "",
            text = token.text;
        return `<a href="${href}" ${title} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
};
marked.use({ renderer });

async function parseMarkdown(markdown) {
    const html = await marked.parse(markdown);
    return DOMPurify.sanitize(html, {
        ALLOWED_ATTR: ["href", "target", "rel", "title", "class", "id"],
    });
}

function App() {
    const [isLoaded, setIsLoaded] = useState(false),
        [user, setUser] = useState(),
        [chatHistory, setChatHistory] = useState([]),
        [parsedChat, setParsedChat] = useState([]),
        [previousResponseId, setPreviousResponseId] = useState(),
        messagesRef = useRef(),
        streamRef = useRef(),
        efforts = ["none", "low", "medium", "high", "xhigh", "max"];

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (userCred) => {
            !isLoaded && setIsLoaded(true);
            setUser(userCred?.email);
        });
        return unsub;
    }, []);

    async function handleChat(e) {
        e.preventDefault();
        const instructions = e.target.instructions.value,
            input = e.target.input.value,
            effort = e.target.effort.value,
            body = { instructions, input, effort, previousResponseId };
        e.target.input.value = "";
        setChatHistory((hist) => [...hist, { text: input }]);
        const parsedInput = await parseMarkdown(input);
        setParsedChat((hist) => [...hist, { text: parsedInput }]);
        messagesRef.current.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: "smooth",
        });
        const response = await fetch(endpoints.chat, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        streamRef.current.textContent = "";
        streamRef.current.style.display = "block";
        const reader = response.body.getReader(),
            decoder = new TextDecoder();
        let buffer = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop();
            for (const line of lines) {
                if (!line.trim()) continue;
                const event = JSON.parse(line);
                if (event.type === "delta") {
                    streamRef.current.textContent += event.text;
                }
                if (event.type === "done") {
                    console.log("AI USAGE:", event.usage);
                    // Save this for previous_response_id
                    setPreviousResponseId(event.responseId);
                }
            }
        }
        const responseText = streamRef.current.textContent;
        setChatHistory((hist) => [
            ...hist,
            { type: "response", text: responseText },
        ]);
        const parsedResponse = await parseMarkdown(responseText);
        setParsedChat((hist) => [
            ...hist,
            { type: "response", text: parsedResponse },
        ]);
        streamRef.current.style.display = "none";
    }

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
            <div id="ai-chat">
                <div id="inputs">
                    <h1>AI Chat</h1>
                    <button onClick={() => signOut(auth)}>sign out</button>

                    <br />
                    <br />

                    <form id="message-form" onSubmit={handleChat}>
                        <textarea
                            name="instructions"
                            placeholder="instructions..."
                        ></textarea>

                        <br />

                        <textarea
                            name="input"
                            placeholder="input..."
                        ></textarea>

                        <br />

                        <nav>
                            <label>
                                effort:{" "}
                                <select name="effort" defaultValue="low">
                                    {efforts.map((effort) => (
                                        <option value={effort}>{effort}</option>
                                    ))}
                                </select>
                            </label>{" "}
                            <button type="submit">submit</button>
                        </nav>
                    </form>
                </div>
                <div ref={messagesRef} id="chat-messages">
                    {parsedChat.map((message) => (
                        <div
                            className={`message ${message.type || ""}`.trim()}
                            dangerouslySetInnerHTML={{ __html: message.text }}
                        ></div>
                    ))}
                    <div
                        ref={streamRef}
                        className="message response streaming"
                        style={{ display: "none" }}
                    ></div>
                </div>
            </div>
        ) : (
            <form id="sign-in" onSubmit={handleSignIn}>
                <h1>AI Chat</h1>
                <input type="email" name="email" placeholder="email..." />
                <br />
                <input type="password" name="pw" placeholder="password..." />
                <br />
                <br />
                <button type="submit">sign in</button>
            </form>
        ))
    );
}

export default App;
