import { localizeHtmlPage } from "../utils/localize-html";
import { loadAllNotes, deleteNoteByIdentifier } from "../utils/note-storage";

const getNoteEntryTemplate = ({ key }) => {
    return `
<article class="dn-restaurant-notes__key">
    <div>${key}</div>
    <button class="dn-restaurant-notes__del" data-key="${key}">x</button>
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

    // Hide emtpy State
    document.querySelector(".dn-restaurant-notes__notes-empty").style.display =
        "none";

    const wrapper = document.querySelector(".dn-restaurant-notes__keys");

    for (let [key, value] of entries) {
        let html = getNoteEntryTemplate({ key });

        const template = document.createElement("template");
        template.innerHTML = html;
        const elements = template.content.children;

        wrapper.appendChild(elements[0]);
    }
}

async function initialize() {
    localizeHtmlPage();

    let notes = await loadAllNotes();
    createElementsForNotes(notes);

    document.addEventListener("click", (evt) => {
        if (!evt.target) {
            return;
        }

        if (evt.target.classList.contains("dn-restaurant-notes__del")) {
            const key = evt.target.dataset.key;
            if (!key) {
                return;
            }

            deleteNoteByIdentifier(key);
        }
    });
}

document.addEventListener("DOMContentLoaded", initialize);
