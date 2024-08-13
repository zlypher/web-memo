import { localizeHtmlPage } from "../../utils/localize-html";

async function initialize() {
    localizeHtmlPage();

    document.querySelector(".dn-restaurant-notes__toggle-tracking").addEventListener("click", () => {
        // TODO
    })
}

document.addEventListener("DOMContentLoaded", initialize);
