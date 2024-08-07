import browser from "webextension-polyfill";
import { localizeHtmlPage } from "../utils/localize-html";

async function loadAllSavedNotes() {
    return await browser.storage.sync.get();
}

function createElementsForNotes(notes) {
    const container = document.querySelector(".dn-restaurant-notes__keys");
    console.log("container", container);
    if (!container || !notes) {
        return;
    }

    const entries = Object.entries(notes);
    if (!entries?.length) {
        return;
    }

    for (let [key, value] of entries) {
        console.log(key, value);
    }
}

async function initialize() {
    console.log("initialize");

    localizeHtmlPage();

    let results = await loadAllSavedNotes();
    createElementsForNotes(results);
    console.log(results);
}

document.addEventListener("DOMContentLoaded", initialize);
