// TODO: Support different languages and URL structures

const SELECTOR_DISHES = "[data-qa=item]";
const SELECTOR_RESTAURANT_HEADER = "[data-qa=restaurant-header]";
const CLASS_NOTES_TEXT = "dn-restaurant-notes__text";
const SELECTOR_NOTES_TEXT = `.${CLASS_NOTES_TEXT}`;

const EXTRACT_IDENTIFIER_REGEX = /\/speisekarte\/([\w-]*)/;

const getRestaurantNotesTemplate = (notes) => `
<div style="display: inline-flex">
    <style>
        #dn-restaurant-notes-popover:popover-open {
            display: flex;
            flex-direction: column;
            padding: 0.5em;
            border: 1px solid #f1f5f9;
            width: 500px;
            max-width: 100%;
            color: #0f172a;
        }

        #dn-restaurant-notes-popover::backdrop {
            background-color: #0f172a66;
        }

        .dn-restaurant-header {
            font-size: 1em;
            margin: 0 0 0.5em;
        }

        .${CLASS_NOTES_TEXT} {
            display: block;
            margin-bottom: 0.5em;
            width: 100%;
            font-size: 0.75em;
        }

        .dn-restaurant-notes__save {
            align-self: flex-end;
            font-size: 0.75em;
        }
    </style>
    <button class="dn-restaurant-notes" popovertarget="dn-restaurant-notes-popover">x</button>
    <dialog id="dn-restaurant-notes-popover" popover>
    <h1 class="dn-restaurant-header">Restaurant Notes Popover</h1>
    <textarea class="${CLASS_NOTES_TEXT}">${notes}</textarea>
    <button class="dn-restaurant-notes__save">Speichern</button>
    </dialog>
</div>
`;

(async () => {
    let identifier;

    async function waitForPageLoaded() {
        for (let i = 0; i < 5; ++i) {
            console.log("Check for loaded page");
            if (document.querySelectorAll(SELECTOR_DISHES).length > 0) {
                return;
            }

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        }

        throw "Didn't detect page loaded in time";
    }

    function extractIdentifierFromUrl() {
        if (!document) {
            return undefined;
        }

        const { pathname } = document.location;
        const result = pathname.match(EXTRACT_IDENTIFIER_REGEX);
        if (!result) {
            return undefined;
        }

        return result[1];
    }

    async function loadNotesByIdentifier(identifier) {
        const key = `NOTES_${identifier}`;

        try {
            let results = await browser.storage.sync.get(key);
            if (results?.hasOwnProperty(key)) {
                return results[key];
            }

            return undefined;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async function saveNotes(identifier, notes) {
        const obj = {};
        obj[`NOTES_${identifier}`] = notes;

        try {
            let res = await browser.storage.sync.set(obj);

            console.log(res);
        } catch (e) {
            console.error(e);
        }

        // TODO: Extract
        document.querySelector("#dn-restaurant-notes-popover").hidePopover();
    }

    function attachUiElements(notes) {
        const headerEl = document.querySelector(SELECTOR_RESTAURANT_HEADER);
        if (!headerEl) {
            return;
        }

        const insertAtEl = headerEl.querySelector("[data-qa=heading]");
        if (!insertAtEl) {
            return;
        }

        const domParser = new DOMParser();
        const elem = domParser.parseFromString(
            getRestaurantNotesTemplate(notes),
            "text/html"
        ).body.firstElementChild;

        insertAtEl.appendChild(elem);

        return;
    }

    function onClickRestaurantNotes(evt) {
        console.log("click restaurant notes");
    }

    function onClickRestaurantNotesSave() {
        const notes = document.querySelector(SELECTOR_NOTES_TEXT).value;
        saveNotes(identifier, notes);
    }

    function attachEventListeners() {
        document.addEventListener("click", (evt) => {
            const t = evt.target;
            if (!t) {
                return;
            }

            if (t.classList.contains("dn-restaurant-notes")) {
                onClickRestaurantNotes(evt);
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

    try {
        await waitForPageLoaded();
        identifier = extractIdentifierFromUrl();
        if (!identifier) {
            return;
        }
        console.log(`Found identifier: ${identifier}`);
        const notes = await loadNotesByIdentifier(identifier);
        console.log("notes", notes);

        attachUiElements(notes || "");
        attachEventListeners();
    } catch (e) {
        // TODO: ?
    }
})();
