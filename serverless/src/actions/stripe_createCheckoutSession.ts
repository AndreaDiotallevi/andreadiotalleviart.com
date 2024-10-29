import Stripe from "stripe"

import { initialiseClient } from "./stripe_initialiseClient"

export const createCheckoutSession = async (params: {
    line_items: Stripe.Checkout.SessionCreateParams["line_items"]
    success_url: string
    currency: string
    discounts: Stripe.Checkout.SessionCreateParams["discounts"]
}): Promise<{ session?: Stripe.Checkout.Session; error?: string }> => {
    try {
        const stripe = await initialiseClient()

        const { line_items, success_url, currency, discounts } = params

        console.log("Creating checkout session...")

        const session = await stripe.checkout.sessions.create({
            expand: ["line_items"],
            ui_mode: "embedded",
            mode: "payment",
            return_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
            line_items,
            invoice_creation: { enabled: true },
            shipping_address_collection: { allowed_countries: countriesArray },
            shipping_options: [],
            currency,
            discounts,
        })
        console.log(session)

        return { session }
    } catch (error) {
        console.error(error)
        const stripeError = error as {
            raw: {
                code: string // "promotion_code_used_up" | "resource_missing"
                message: string
                param: string
            }
        }
        return { error: stripeError.raw.message }
    }
}

const countriesArray: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
    [
        "GB", // United Kingdom
        "IM", // Isle of Man (Crown Dependency)
        "JE", // Jersey (Crown Dependency)
        "GG", // Guernsey (Crown Dependency)
        "US", // United States

        // EU Member States
        "AT", // Austria
        "BE", // Belgium
        "BG", // Bulgaria
        "CY", // Cyprus
        "CZ", // Czech Republic
        "DE", // Germany
        "DK", // Denmark
        "EE", // Estonia
        "ES", // Spain
        "FI", // Finland
        "FR", // France
        "GR", // Greece
        "HR", // Croatia
        "HU", // Hungary
        "IE", // Ireland
        "IT", // Italy
        "LT", // Lithuania
        "LU", // Luxembourg
        "LV", // Latvia
        "MT", // Malta
        "NL", // Netherlands
        "PL", // Poland
        "PT", // Portugal
        "RO", // Romania
        "SE", // Sweden
        "SI", // Slovenia
        "SK", // Slovakia

        // EEA / Other European Countries
        "NO", // Norway
        "IS", // Iceland
        "LI", // Liechtenstein
        "CH", // Switzerland

        // Other countries (commented out for now)
        // "AC", // Ascension Island
        // "AE", // United Arab Emirates
        // "AF", // Afghanistan
        // "AG", // Antigua and Barbuda
        // "AI", // Anguilla
        // "AL", // Albania
        // "AM", // Armenia
        // "AO", // Angola
        // "AQ", // Antarctica
        // "AR", // Argentina
        // "AW", // Aruba
        // "AX", // Åland Islands
        // "AZ", // Azerbaijan
        // "BA", // Bosnia and Herzegovina
        // "BB", // Barbados
        // "BD", // Bangladesh
        // "BF", // Burkina Faso
        // "BH", // Bahrain
        // "BI", // Burundi
        // "BJ", // Benin
        // "BL", // Saint Barthélemy
        // "BM", // Bermuda
        // "BN", // Brunei
        // "BO", // Bolivia
        // "BQ", // Bonaire, Sint Eustatius and Saba
        // "BR", // Brazil
        // "BS", // Bahamas
        // "BT", // Bhutan
        // "BV", // Bouvet Island
        // "BW", // Botswana
        // "BY", // Belarus
        // "BZ", // Belize
        // "CD", // Congo (the Democratic Republic of the)
        // "CF", // Central African Republic
        // "CG", // Congo (the Republic of the)
        // "CI", // Côte d'Ivoire
        // "CK", // Cook Islands
        // "CL", // Chile
        // "CM", // Cameroon
        // "CN", // China
        // "CO", // Colombia
        // "CR", // Costa Rica
        // "CV", // Cape Verde
        // "CW", // Curaçao
        // "DJ", // Djibouti
        // "DM", // Dominica
        // "DO", // Dominican Republic
        // "DZ", // Algeria
        // "EC", // Ecuador
        // "EG", // Egypt
        // "EH", // Western Sahara
        // "ER", // Eritrea
        // "ET", // Ethiopia
        // "FJ", // Fiji
        // "FK", // Falkland Islands
        // "FO", // Faroe Islands
        // "GA", // Gabon
        // "GD", // Grenada
        // "GE", // Georgia
        // "GF", // French Guiana
        // "GH", // Ghana
        // "GI", // Gibraltar
        // "GL", // Greenland
        // "GM", // Gambia
        // "GN", // Guinea
        // "GP", // Guadeloupe
        // "GQ", // Equatorial Guinea
        // "GT", // Guatemala
        // "GU", // Guam
        // "GW", // Guinea-Bissau
        // "GY", // Guyana
        // "HK", // Hong Kong
        // "HN", // Honduras
        // "HT", // Haiti
        // "ID", // Indonesia
        // "IL", // Israel
        // "IN", // India
        // "IQ", // Iraq
        // "JM", // Jamaica
        // "JO", // Jordan
        // "JP", // Japan
        // "KE", // Kenya
        // "KG", // Kyrgyzstan
        // "KH", // Cambodia
        // "KI", // Kiribati
        // "KM", // Comoros
        // "KN", // Saint Kitts and Nevis
        // "KR", // South Korea
        // "KW", // Kuwait
        // "KY", // Cayman Islands
        // "KZ", // Kazakhstan
        // "LA", // Laos
        // "LB", // Lebanon
        // "LC", // Saint Lucia
        // "LK", // Sri Lanka
        // "LR", // Liberia
        // "LS", // Lesotho
        // "LY", // Libya
        // "MA", // Morocco
        // "MC", // Monaco
        // "MD", // Moldova
        // "ME", // Montenegro
        // "MF", // Saint Martin (French part)
        // "MG", // Madagascar
        // "MK", // North Macedonia
        // "ML", // Mali
        // "MM", // Myanmar
        // "MN", // Mongolia
        // "MO", // Macao
        // "MQ", // Martinique
        // "MR", // Mauritania
        // "MS", // Montserrat
        // "MU", // Mauritius
        // "MV", // Maldives
        // "MW", // Malawi
        // "MX", // Mexico
        // "MZ", // Mozambique
        // "NA", // Namibia
        // "NC", // New Caledonia
        // "NE", // Niger
        // "NG", // Nigeria
        // "NI", // Nicaragua
        // "NP", // Nepal
        // "NR", // Nauru
        // "NU", // Niue
        // "NZ", // New Zealand
        // "OM", // Oman
        // "PA", // Panama
        // "PE", // Peru
        // "PF", // French Polynesia
        // "PG", // Papua New Guinea
        // "PH", // Philippines
        // "PK", // Pakistan
        // "PM", // Saint Pierre and Miquelon
        // "PN", // Pitcairn Islands
        // "PR", // Puerto Rico
        // "PS", // Palestine
        // "PY", // Paraguay
        // "QA", // Qatar
        // "RE", // Réunion
        // "RS", // Serbia
        // "RU", // Russia
        // "RW", // Rwanda
        // "SA", // Saudi Arabia
        // "SB", // Solomon Islands
        // "SC", // Seychelles
        // "SH", // Saint Helena
        // "SJ", // Svalbard and Jan Mayen
        // "SL", // Sierra Leone
        // "SM", // San Marino
        // "SN", // Senegal
        // "SO", // Somalia
        // "SR", // Suriname
        // "SS", // South Sudan
        // "ST", // São Tomé and Príncipe
        // "SV", // El Salvador
        // "SX", // Sint Maarten
        // "SZ", // Eswatini (Swaziland)
        // "TA", // Tristan da Cunha
        // "TC", // Turks and Caicos Islands
        // "TD", // Chad
        // "TF", // French Southern Territories
        // "TG", // Togo
        // "TH", // Thailand
        // "TJ", // Tajikistan
        // "TK", // Tokelau
        // "TL", // Timor-Leste
        // "TM", // Turkmenistan
        // "TN", // Tunisia
        // "TO", // Tonga
        // "TR", // Turkey
        // "TT", // Trinidad and Tobago
        // "TV", // Tuvalu
        // "TW", // Taiwan
        // "TZ", // Tanzania
        // "UA", // Ukraine
        // "UG", // Uganda
        // "UY", // Uruguay
        // "UZ", // Uzbekistan
        // "VA", // Vatican City
        // "VC", // Saint Vincent and the Grenadines
        // "VE", // Venezuela
        // "VG", // British Virgin Islands
        // "VN", // Vietnam
        // "VU", // Vanuatu
        // "WF", // Wallis and Futuna
        // "WS", // Samoa
        // "XK", // Kosovo
        // "YE", // Yemen
        // "YT", // Mayotte
        // "ZA", // South Africa
        // "ZM", // Zambia
        // "ZW", // Zimbabwe
        // "ZZ", // Unknown or Invalid Region
    ]
