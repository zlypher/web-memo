import { localizeHtmlPage } from "../utils/localize-html";
import { loadAllNotes } from "../utils/note-storage";

const getNoteEntryTemplate = ({ key }) => {
    return `
    <article>
        <div>${key}</div>
    </article>
    `;
};

function createElementsForNotes(notes) {
    const container = document.querySelector(".dn-restaurant-notes__keys");
    if (!container || !notes) {
        return;
    }

    const entries = Object.entries(notes);
    if (!entries?.length) {
        return;
    }

    const wrapper = document.querySelector(".dn-restaurant-notes__keys");

    for (let [key, value] of entries) {
        let html = getNoteEntryTemplate({ key });

        const template = document.createElement("template");
        template.innerHTML = html;
        const elements = template.content.children;

        wrapper.appendChild(elements[0]);
    }
}

function initTrackingHandler() {
    document
        .querySelector(".dn-restaurant-notes__toggle-tracking")
        .addEventListener("click", () => {
            // TBD
        });
}

async function initialize() {
    localizeHtmlPage();

    let notes = await loadAllNotes();
    createElementsForNotes(notes);
    initTrackingHandler();
}

document.addEventListener("DOMContentLoaded", initialize);
