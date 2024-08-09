import browser from "webextension-polyfill";
import mixpanel from "mixpanel-browser";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { loadNotesByIdentifier, saveNotes } from "../utils/note-storage";
import { localizeHtmlPage } from "../utils/localize-html";

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

async function getCurrentActiveTabUrl() {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    const url = tabs[0].url;
    return url;
}

function hideDntNote() {
    document.querySelector(".dn-restaurant-notes__dnt").classList.add("hidden");
}

function initializePopup() {
    localizeHtmlPage();

    if (mixpanel.has_opted_out_tracking()) {
        hideDntNote();
    }
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
        .querySelector(".dn-restaurant-notes__dnt")
        .addEventListener("click", () => {
            mixpanel.opt_out_tracking();
            hideDntNote();
        });

    document
        .querySelector(".dn-restaurant-notes__save")
        .addEventListener("click", () => {
            mixpanel.track("Save Notes");
            const notes = quill.getContents();

            saveNotes(identifier, notes);
        });
}

document.addEventListener("DOMContentLoaded", initialize);
