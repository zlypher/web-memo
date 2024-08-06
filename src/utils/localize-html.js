export function localizeHtmlPage() {
    let nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach((node) => {
        let target = node.getAttribute("data-i18n-target");
        let key = target ? node.getAttribute(target) : node.textContent;
        let translated = chrome.i18n.getMessage(key);
        if (target) {
            node.setAttribute(target, translated);
        } else {
            node.textContent = translated;
        }
    });
}
