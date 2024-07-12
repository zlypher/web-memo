// TODO: Support different languages and URL structures

(async () => {
    async function waitForPageLoaded() {
        for (let i = 0; i < 5; ++i) {
            console.log("Check for loaded page");
            if (document.querySelectorAll("[data-qa=item]").length > 0) {
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
        const result = pathname.match(/\/speisekarte\/([\w-]*)/);
        if (!result) {
            return undefined;
        }

        return result[1];
    }

    function loadNotesByIdentifier(identifier) {
        return undefined;
    }

    function attachUiElements() {
        const dishesEl = document.querySelectorAll("[data-qa=item]");
        console.log(dishesEl);
        if (!dishesEl) {
            return;
        }

        for (let i = 0; i < dishesEl.length; ++i) {
            attachUiElementsForDish(dishesEl[i]);
        }

        return;
    }

    function attachUiElementsForDish(dishEl) {
        if (!dishEl) {
            return;
        }

        const headingEl = dishEl.querySelector("[data-qa=heading]");
        if (!headingEl) {
            return;
        }

        const dishname = headingEl.innerText;
        console.log(dishname);
    }

    function attachEventListeners() {
        return;
    }

    function initialize() {
        console.log("Delivery Notes");
        const identifier = extractIdentifierFromUrl();
        console.log(identifier);
        if (!identifier) {
            return;
        }
        console.log(`Found identifier: ${identifier}`);
        const notes = loadNotesByIdentifier(identifier);
        console.log(notes);

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
