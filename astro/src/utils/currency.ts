import type { Currency } from "./stripe"

const countryCodeToCurrency: Record<string, Currency> = {
    // GBP
    gb: "gbp", // Great Britain (includes England, Scotland, Wales, Northern Ireland)
    im: "gbp", // Isle of Man
    je: "gbp", // Jersey
    gg: "gbp", // Guernsey

    // USD
    us: "usd", // United States

    // EUR
    at: "eur", // Austria
    be: "eur", // Belgium
    bg: "eur", // Bulgaria
    cy: "eur", // Cyprus
    cz: "eur", // Czech Republic
    de: "eur", // Germany
    dk: "eur", // Denmark
    ee: "eur", // Estonia
    es: "eur", // Spain
    fi: "eur", // Finland
    fr: "eur", // France
    gr: "eur", // Greece
    hr: "eur", // Croatia
    hu: "eur", // Hungary
    ie: "eur", // Ireland
    it: "eur", // Italy
    lt: "eur", // Lithuania
    lu: "eur", // Luxembourg
    lv: "eur", // Latvia
    mt: "eur", // Malta
    nl: "eur", // Netherlands
    pl: "eur", // Poland
    pt: "eur", // Portugal
    ro: "eur", // Romania
    se: "eur", // Sweden
    si: "eur", // Slovenia
    sk: "eur", // Slovakia
    no: "eur", // Norway
    is: "eur", // Iceland
    li: "eur", // Liechtenstein
    ch: "eur", // Switzerland
}

function combineCountriesByCurrency(
    countryMap: Record<string, Currency>,
): string {
    const currencyGroups: Record<string, string[]> = {}

    for (const [countryCode, currency] of Object.entries(countryMap)) {
        if (!currencyGroups[currency]) {
            currencyGroups[currency] = []
        }
        currencyGroups[currency].push(countryCode)
    }

    const combinedArray = Object.entries(currencyGroups).map(
        ([currency, countries]) => {
            return countries.join("+")
        },
    )

    return combinedArray.join("|")
}

export const combinedCountries = combineCountriesByCurrency(
    countryCodeToCurrency,
)

// Output: "gb+im+je+gg|us|at+be+bg+cy+cz+de+dk+ee+es+fi+fr+gr+hr+hu+ie+it+lt+lu+lv+mt+nl+pl+pt+ro+se+si+sk+no+is+li+ch"

export const getLocalCurrency = (countryCode?: string): Currency => {
    return (
        countryCodeToCurrency[countryCode?.toLocaleLowerCase() || ""] || "gbp"
    )
}

export const supportedCurrencies: Currency[] = ["gbp", "eur", "usd"]

export const supportedLocales = ["en-gb", "en-us", "en"] as const
export type SupportedLocale = typeof supportedLocales[number]
export const defaultLocale: SupportedLocale = "en-gb"
export const localeToCurrency: Record<SupportedLocale, Currency> = {
    "en-gb": "gbp",
    "en-us": "usd",
    en: "eur",
}

export const currencyToLocale: Record<Currency, SupportedLocale> = {
    gbp: "en-gb",
    usd: "en-us",
    eur: "en",
}
