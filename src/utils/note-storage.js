import browser from "webextension-polyfill";

export async function loadAllNotes() {
    return await browser.storage.sync.get();
}

/**
 * Load the notes for the current restaurant identified via the identifier
 * from the sync storage. If there are no notes yet, or there is an error,
 * return undefined.
 */
export async function loadNotesByIdentifier(identifier) {
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

/**
 * Saves the notes for the current restaurant identified by the
 * identifier.
 */
export async function saveNotes(identifier, notes) {
    const key = `NOTES_${identifier}`;

    try {
        await browser.storage.sync.set({ [key]: notes });
    } catch (e) {
        console.error(e);
    }
}
