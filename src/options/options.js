import { localizeHtmlPage } from "../utils/localize-html";
import { loadAllMemos, deleteMemoByIdentifier } from "../utils/memo-storage";

const getMemoEntryTemplate = ({ key }) => {
    return `
<article class="key">
    <div><a href="${key}" target="_blank">${key}</a></div>
    <button class="del" data-key="${key}">x</button>
</article>
    `;
};

function findMemoEl(currentEl) {
    if (!currentEl) {
        return;
    }

    if (currentEl.classList.contains("key")) {
        return currentEl;
    }

    return findMemoEl(currentEl.parentNode);
}

function deleteMemo(deleteBtnEl) {
    if (!deleteBtnEl) {
        return;
    }

    const key = deleteBtnEl.dataset.key;
    if (!key) {
        return;
    }

    deleteMemoByIdentifier(key);

    let memoEl = findMemoEl(deleteBtnEl);
    if (!memoEl) {
        return;
    }

    memoEl.remove();
}

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
            deleteMemo(evt.target);
        }
    });
}

document.addEventListener("DOMContentLoaded", initialize);
