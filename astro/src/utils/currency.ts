import type { Currency } from "./stripe"

const countryNameToCurrency: Record<string, Currency> = {
    // GBP
    "United Kingdom": "gbp",
    "Isle of Man": "gbp",
    Jersey: "gbp",
    Guernsey: "gbp",

    // USD
    "United States": "usd",

    // EUR
    Austria: "eur",
    Belgium: "eur",
    Bulgaria: "eur",
    Cyprus: "eur",
    "Czech Republic": "eur",
    Germany: "eur",
    Denmark: "eur",
    Estonia: "eur",
    Spain: "eur",
    Finland: "eur",
    France: "eur",
    Greece: "eur",
    Croatia: "eur",
    Hungary: "eur",
    Ireland: "eur",
    Italy: "eur",
    Lithuania: "eur",
    Luxembourg: "eur",
    Latvia: "eur",
    Malta: "eur",
    Netherlands: "eur",
    Poland: "eur",
    Portugal: "eur",
    Romania: "eur",
    Sweden: "eur",
    Slovenia: "eur",
    Slovakia: "eur",
    Norway: "eur",
    Iceland: "eur",
    Liechtenstein: "eur",
    Switzerland: "eur",
}

export const getLocalCurrency = (countryName?: string): Currency => {
    return countryNameToCurrency[countryName || ""] || "gbp"
}
