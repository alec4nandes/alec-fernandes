import { truths } from "./model.js";
import Truths from "./view.js";

Truths(truths).then((html) => {
    document.querySelector("main").innerHTML = html;
});
