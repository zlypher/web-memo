// https://stackoverflow.com/a/25612056/733368
export function localizeHtmlPage() {
    //Localize by replacing __MSG_***__ meta tags
    let objects = document.getElementsByTagName("html");
    for (const obj of objects) {
        let valStrH = obj.innerHTML.toString();
        let valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });

        if (valNewH != valStrH) {
            obj.innerHTML = valNewH;
        }
    }
}
