import browser from "webextension-polyfill";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { loadMemosByIdentifier, saveMemos } from "../utils/memo-storage";
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

    // Load notes if there are already some stored
    const identifier = await getCurrentActiveTabUrl();
    const savedMemos = await loadMemosByIdentifier(identifier);
    if (savedMemos) {
        quill.setContents(savedMemos);
    }

    document.querySelector(".options").addEventListener("click", async () => {
        await browser.runtime.openOptionsPage();
    });

    document.querySelector(".save").addEventListener("click", () => {
        const notes = quill.getContents();
        saveMemos(identifier, notes);
    });
}

document.addEventListener("DOMContentLoaded", initialize);
