import browser from "webextension-polyfill";
import mixpanel from "mixpanel-browser";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { loadNotesByIdentifier, saveNotes } from "../note-storage";
import { extractIdentifierFromUrl, isRelevantUrl } from "../url-identifier";
import { localizeHtmlPage } from "../localize-html";

mixpanel.init("b6a9bb270b20eadfaf653f4bb86b9412", {
    track_pageview: true,
    api_host: "https://api-eu.mixpanel.com",
    ip: false,
    persistence: "localStorage",
    property_blacklist: [
        "$os",
        "$screen_height",
        "$screen_width",
        "$device_id",
    ],
});
mixpanel.identify("web-ext");

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

    if (mixpanel.has_opted_out_tracking()) {
        document
            .querySelector(".dn-restaurant-notes__dnt")
            .classList.add("hidden");
    }
    const quill = new Quill("#editor", {
        placeholder: browser.i18n.getMessage("popupTextPlaceholder"),
        theme: "snow",
    });

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
        quill.setContents(savedNotes);
    }

    document
        .querySelector(".dn-restaurant-notes__dnt")
        .addEventListener("click", () => {
            mixpanel.opt_out_tracking();
        });

    document
        .querySelector(".dn-restaurant-notes__save")
        .addEventListener("click", () => {
            mixpanel.track("Save Notes");
            const notes = quill.getContents();
            console.log(notes);

            saveNotes(identifier, notes);
        });
}

document.addEventListener("DOMContentLoaded", initialize);
