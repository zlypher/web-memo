import { localizeHtmlPage } from "../utils/localize-html";
import { loadAllMemos, deleteMemoByIdentifier } from "../utils/memo-storage";

const getMemoEntryTemplate = ({ key }) => {
    return `
<article class="key">
    <div>${key}</div>
    <button class="del" data-key="${key}">x</button>
</article>
    `;
};

function createElementsForMemos(notes) {
    const container = document.querySelector(".keys");
    if (!container || !notes) {
        return;
    }

    const entries = Object.entries(notes);
    if (!entries?.length) {
        return;
    }

    // Hide emtpy State
    document.querySelector(".notes-empty").style.display = "none";

    const wrapper = document.querySelector(".keys");

    for (let [key, value] of entries) {
        let html = getMemoEntryTemplate({ key });

        const template = document.createElement("template");
        template.innerHTML = html;
        const elements = template.content.children;

        wrapper.appendChild(elements[0]);
    }
}

async function initialize() {
    localizeHtmlPage();

    let notes = await loadAllMemos();
    createElementsForMemos(notes);

    document.addEventListener("click", (evt) => {
        if (!evt.target) {
            return;
        }

        if (evt.target.classList.contains("del")) {
            const key = evt.target.dataset.key;
            if (!key) {
                return;
            }

            deleteMemoByIdentifier(key);
        }
    });
}

document.addEventListener("DOMContentLoaded", initialize);
