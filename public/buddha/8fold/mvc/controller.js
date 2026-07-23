import { noble8 } from "./model.js";
import { lists } from "../lists.js";
import { getHTML } from "./view.js";

document.querySelector("main").innerHTML = getHTML(noble8, lists);
