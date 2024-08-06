import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
    if (temporary) return; // skip during development
    switch (reason) {
        case "install":
            {
                const url = browser.runtime.getURL("dist/views/installed.html");
                await browser.tabs.create({ url });
            }
            break;
    }
});
