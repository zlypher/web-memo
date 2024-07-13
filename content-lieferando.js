// TODO: Support different languages and URL structures

const SELECTOR_DISHES = "[data-qa=item]";
const SELECTOR_RESTAURANT_HEADER = "[data-qa=restaurant-header]";
const EXTRACT_IDENTIFIER_REGEX = /\/speisekarte\/([\w-]*)/;
const RESTAURANT_NOTES_BUTTON = `
<div style="display: inline-flex">
    <button class="dn-restaurant-notes" popovertarget="dn-restaurant-notes-popover">x</button>
    <dialog id="dn-restaurant-notes-popover" popover>Restaurant Notes Popover</dialog>
</div>
`;

(async () => {
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

    function loadNotesByIdentifier(identifier) {
        return undefined;
    }

    function attachUiElements() {
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
            RESTAURANT_NOTES_BUTTON,
            "text/html"
        ).body.firstElementChild;
        console.log(elem);

        insertAtEl.appendChild(elem);

        return;
    }

    function onClickRestaurantNotes(evt) {
        console.log("click restaurant notes");
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

            // TODO
        });

        return;
    }

    function initialize() {
        const identifier = extractIdentifierFromUrl();
        if (!identifier) {
            return;
        }
        console.log(`Found identifier: ${identifier}`);
        const notes = loadNotesByIdentifier(identifier);

        attachUiElements();
        attachEventListeners();
    }

    try {
        await waitForPageLoaded();
        initialize();
    } catch (e) {
        // TODO: ?
    }
})();
