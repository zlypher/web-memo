import { localizeHtmlPage } from "../../utils/localize-html";

async function initialize() {
    localizeHtmlPage();
}

document.addEventListener("DOMContentLoaded", initialize);
