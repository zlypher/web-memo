
/**
 * https://www.lieferando.at/speisekarte/tre-m
 * https://www.lieferando.at/speisekarte/pizzeria-san-carino-liesing
 * https://www.lieferando.at/speisekarte/ristorante-elianto
 * 
 * https://www.lieferando.at/en/menu/china-restaurant-duft-in-wien
 * https://www.lieferando.at/en/shop/bringa-spezial-snack-shop
 * https://www.lieferando.at/fr/menu/il-mondo-wien-1
 * https://www.lieferando.at/it/menu/vienna-pizza-1170
 * 
 * https://www.lieferando.de/speisekarte/yumcha-heroes-new-owner
 * https://www.lieferando.de/en/menu/yumcha-heroes-new-owner
 * 
 * https://www.just-eat.ch/speisekarte/janni-zrich
 * https://www.just-eat.ch/en/menu/janni-zrich
 * 
 * https://www.just-eat.dk/menu/gerners-grill-2
 * https://www.just-eat.dk/en/menu/gerners-grill-2
 * 
 * https://www.just-eat.es/restaurants-kenji-pro-barcelona-08015/menu
 * https://www.just-eat.es/restaurants-boko-barcelona-08028/menu
 * 
 * https://www.skipthedishes.com/pho-vy-fort-street
 * https://www.skipthedishes.com/fr/pho-vy-fort-street
 */

const URL_WHITELIST = [
    // Lieferando
    "www.lieferando.at",
    "www.lieferando.de",
    "www.just-eat.ch",
    "www.just-eat.dk",
    "www.just-eat.es",
    "www.skipthedishes.com"
];

// (?:\/speisekarte\/([\w-]*))|(?:\/\w{2}\/(?:menu|shop)\/([\w-]*))
const EXTRACT_IDENTIFIER_LIEFERANDO_AT_REGEX = /\/speisekarte\/([\w-]*)/;

export function isRelevantUrl(url) {
    return false;
}

/**
 * Try to extract and return an unique identifier for the restaurant
 * from the pathname of the URL. If the extraction fails for any
 * reason, return undefined.
 */
export function extractIdentifierFromUrl(pathname) {
    if (!pathname) {
        return undefined;
    }

    const result = pathname.match(EXTRACT_IDENTIFIER_LIEFERANDO_AT_REGEX);
    if (!result) {
        return undefined;
    }

    return result[1];
}