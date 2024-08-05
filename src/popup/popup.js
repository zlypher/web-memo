import browser from "webextension-polyfill";
import { loadNotesByIdentifier, saveNotes } from "../note-storage";
import { extractIdentifierFromUrl, isRelevantUrl } from "../url-identifier";
import { localizeHtmlPage } from "../localize-html";

let identifier;

async function getCurrentActiveTabUrl() {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    const url = tabs[0].url;
    return url;
}

async function initialize() {
    localizeHtmlPage();

    const url = await getCurrentActiveTabUrl();
    // Step 1: Check URL
    if (!isRelevantUrl(url)) {
        return;
    }

    // Step 2: Find a unique identifier for the current restaurant
    identifier = extractIdentifierFromUrl(url);
    if (!identifier) {
        return;
    }

    // Step 3: Load notes if there are already some stored
    const savedNotes = await loadNotesByIdentifier(identifier);
    if (savedNotes) {
        document.querySelector(".dn-restaurant-notes__text").value = savedNotes;
    }

    document
        .querySelector(".dn-restaurant-notes__save")
        .addEventListener("click", () => {
            console.log("on click");
            const notes = document.querySelector(
                ".dn-restaurant-notes__text"
            ).value;

            saveNotes(identifier, notes);
        });
}

document.addEventListener("DOMContentLoaded", initialize);
