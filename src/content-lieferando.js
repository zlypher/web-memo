// TODO: Support different languages and URL structures
import { loadNotesByIdentifier, saveNotes } from "./note-storage";
import { CLASS_NOTES_TEXT, getRestaurantNotesTemplate } from "./popover-utils";

const SELECTOR_DISHES = "[data-qa=item]";
const SELECTOR_RESTAURANT_HEADER = "[data-qa=restaurant-header]";
const SELECTOR_NOTES_TEXT = `.${CLASS_NOTES_TEXT}`;
const EXTRACT_IDENTIFIER_REGEX = /\/speisekarte\/([\w-]*)/;

let identifier;

/**
 * Lieferando loads the dishes async. This methods tries to find the
 * dishes in the dom. If it can't find it, it waits a second and retries.
 * After 5 tries, it fails and we can't proceed.
 */
async function waitForPageLoaded() {
    for (let i = 0; i < 5; ++i) {
        if (document.querySelectorAll(SELECTOR_DISHES).length > 0) {
            return;
        }

        await new Promise((res) => setTimeout(res, 1000));
    }

    throw new Error("Didn't detect page loaded in time");
}

/**
 * Try to extract and return an unique identifier for the restaurant
 * from the pathname of the URL. If the extraction fails for any
 * reason, return undefined.
 */
function extractIdentifierFromUrl(pathname) {
    if (!pathname) {
        return undefined;
    }

    const result = pathname.match(EXTRACT_IDENTIFIER_REGEX);
    if (!result) {
        return undefined;
    }

    return result[1];
}

function closePopover() {
    document.querySelector("#dn-restaurant-notes-popover").hidePopover();
}

/**
 * Attach all necessary UI Elements, for this extension to work, to the DOM.
 * If we can't find the correct place to insert into the DOM, throw an error.
 */
function attachUiElements(notes) {
    const headerEl = document.querySelector(SELECTOR_RESTAURANT_HEADER);
    if (!headerEl) {
        throw new Error("Couldn't find Header element to attach elements to");
    }

    const insertAtEl = headerEl.querySelector("[data-qa=heading]");
    if (!insertAtEl) {
        throw new Error("Couldn't find Heading element to attach elements to");
    }

    const domParser = new DOMParser();
    const elem = domParser.parseFromString(
        getRestaurantNotesTemplate(notes),
        "text/html"
    ).body.firstElementChild;

    insertAtEl.appendChild(elem);

    return;
}

/**
 * OnClick-Handler of save button of the popup. Get's the notes from the
 * text element and tries to save it.
 */
function onClickRestaurantNotesSave() {
    const notes = document.querySelector(SELECTOR_NOTES_TEXT).value;
    saveNotes(identifier, notes);
    closePopover();
}

/**
 * Attaches all necessary event listeners, for this extension to work.
 */
function attachEventListeners() {
    document.addEventListener("click", (evt) => {
        const t = evt.target;
        if (!t) {
            return;
        }

        if (t.classList.contains("dn-restaurant-notes__save")) {
            onClickRestaurantNotesSave();
            return;
        }

        // TODO
    });

    return;
}

(async () => {
    try {
        // Step 1: Wait for Page Load (since it is async)
        await waitForPageLoaded();

        // Step 2: Find a unique identifier for the current restaurant
        identifier = extractIdentifierFromUrl(document?.location?.pathname);
        if (!identifier) {
            return;
        }

        // Step 3: Load notes if there are already some stored
        const notes = await loadNotesByIdentifier(identifier);

        // Step 4: Create interactive element to write/edit notes
        attachUiElements(notes || "");
        attachEventListeners();
    } catch (e) {
        console.error("Delivery Notes extension could not start", e);
    }
})();
