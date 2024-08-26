import browser from "webextension-polyfill";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { loadNotesByIdentifier, saveNotes } from "../utils/note-storage";
import { localizeHtmlPage } from "../utils/localize-html";

async function getCurrentActiveTabUrl() {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    const url = tabs[0].url;
    return url;
}

function initializePopup() {
    localizeHtmlPage();

    const quill = new Quill("#editor", {
        placeholder: browser.i18n.getMessage("popupTextPlaceholder"),
        theme: "snow",
    });

    return { quill };
}

async function initialize() {
    const { quill } = initializePopup();

    // Step 3: Load notes if there are already some stored
    const identifier = await getCurrentActiveTabUrl();
    const savedNotes = await loadNotesByIdentifier(identifier);
    if (savedNotes) {
        quill.setContents(savedNotes);
    }

    document
        .querySelector(".dn-restaurant-notes__options")
        .addEventListener("click", async () => {
            await browser.runtime.openOptionsPage();
        });

    document
        .querySelector(".dn-restaurant-notes__save")
        .addEventListener("click", () => {
            const notes = quill.getContents();

            saveNotes(identifier, notes);
        });
}

document.addEventListener("DOMContentLoaded", initialize);
