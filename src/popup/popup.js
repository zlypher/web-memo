import "webextension-polyfill";
import { loadNotesByIdentifier, saveNotes } from "../note-storage";
import { extractIdentifierFromUrl, isRelevantUrl } from "../url-identifier";

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
    const url = await getCurrentActiveTabUrl();
    console.log("url", url);
    // Step 1: Check URL
    if (!isRelevantUrl(url)) {
        return;
    }

    // Step 2: Find a unique identifier for the current restaurant
    identifier = extractIdentifierFromUrl(document?.location?.pathname);
    if (!identifier) {
        return;
    }

    // Step 3: Load notes if there are already some stored
    const savedNotes = await loadNotesByIdentifier(identifier);

    // TODO
    console.log("Started at", new Date());
    document.querySelector(".dn-restaurant-header").innerHTML =
        "Starte at " + new Date();

    document
        .querySelector(".dn-restaurant-notes__save")
        .addEventListener("click", () => {
            // TODO
            const notes = document.querySelector(
                ".dn-restaurant-notes__text"
            ).value;
            saveNotes(identifier, notes);
        });
}

document.addEventListener("DOMContentLoaded", initialize);
