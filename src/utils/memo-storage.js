import browser from "webextension-polyfill";

export async function loadAllMemos() {
    return await browser.storage.sync.get();
}

export async function deleteMemoByIdentifier(identifier) {
    try {
        await browser.storage.sync.remove(identifier);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Load the memos for the current website identified via the identifier
 * from the sync storage. If there are no memos yet, or there is an error,
 * return undefined.
 */
export async function loadMemosByIdentifier(identifier) {
    try {
        let results = await browser.storage.sync.get(identifier);
        if (results?.hasOwnProperty(identifier)) {
            return results[identifier];
        }

        return undefined;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

/**
 * Saves the memos for the current website identified by the
 * identifier.
 */
export async function saveMemos(identifier, memos) {
    try {
        await browser.storage.sync.set({ [identifier]: memos });
    } catch (e) {
        console.error(e);
    }
}
