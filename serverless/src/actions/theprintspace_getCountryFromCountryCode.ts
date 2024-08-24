export const getCountryFromCountryCode = (countryCode?: string | null) => {
    const country = countries.Data.find(country => country.Code === countryCode)

    if (!country) {
        throw new Error(`No country with code ${countryCode}`)
    }

    return country
}

const countries = {
    Data: [
        {
            Id: 1,
            Code: "AD",
            Name: "Andorra",
        },
        {
            Id: 2,
            Code: "AE",
            Name: "United Arab Emirates",
        },
        {
            Id: 3,
            Code: "AF",
            Name: "Afghanistan",
        },
        {
            Id: 4,
            Code: "AG",
            Name: "Antigua and Barbuda",
        },
        {
            Id: 5,
            Code: "AI",
            Name: "Anguilla",
        },
        {
            Id: 6,
            Code: "AL",
            Name: "Albania",
        },
        {
            Id: 7,
            Code: "AM",
            Name: "Armenia",
        },
        {
            Id: 8,
            Code: "AN",
            Name: "Netherlands Antilles",
        },
        {
            Id: 9,
            Code: "AO",
            Name: "Angola",
        },
        {
            Id: 10,
            Code: "AQ",
            Name: "Antarctica",
        },
        {
            Id: 11,
            Code: "AR",
            Name: "Argentina",
        },
        {
            Id: 12,
            Code: "AS",
            Name: "American Samoa",
        },
        {
            Id: 13,
            Code: "AT",
            Name: "Austria",
        },
        {
            Id: 14,
            Code: "AU",
            Name: "Australia",
        },
        {
            Id: 15,
            Code: "AW",
            Name: "Aruba",
        },
        {
            Id: 16,
            Code: "AX",
            Name: "Aland",
        },
        {
            Id: 17,
            Code: "AZ",
            Name: "Azerbaijan",
        },
        {
            Id: 18,
            Code: "BA",
            Name: "Bosnia and Herzegovina",
        },
        {
            Id: 19,
            Code: "BB",
            Name: "Barbados",
        },
        {
            Id: 20,
            Code: "BD",
            Name: "Bangladesh",
        },
        {
            Id: 21,
            Code: "BE",
            Name: "Belgium",
        },
        {
            Id: 22,
            Code: "BF",
            Name: "Burkina Faso",
        },
        {
            Id: 23,
            Code: "BG",
            Name: "Bulgaria",
        },
        {
            Id: 24,
            Code: "BH",
            Name: "Bahrain",
        },
        {
            Id: 25,
            Code: "BI",
            Name: "Burundi",
        },
        {
            Id: 26,
            Code: "BJ",
            Name: "Benin",
        },
        {
            Id: 27,
            Code: "BM",
            Name: "Bermuda",
        },
        {
            Id: 28,
            Code: "BN",
            Name: "Brunei",
        },
        {
            Id: 29,
            Code: "BO",
            Name: "Bolivia",
        },
        {
            Id: 30,
            Code: "BR",
            Name: "Brazil",
        },
        {
            Id: 31,
            Code: "BS",
            Name: "Bahamas",
        },
        {
            Id: 32,
            Code: "BT",
            Name: "Bhutan",
        },
        {
            Id: 33,
            Code: "BV",
            Name: "Bouvet Island",
        },
        {
            Id: 34,
            Code: "BW",
            Name: "Botswana",
        },
        {
            Id: 35,
            Code: "BY",
            Name: "Belarus",
        },
        {
            Id: 36,
            Code: "BZ",
            Name: "Belize",
        },
        {
            Id: 37,
            Code: "CA",
            Name: "Canada",
        },
        {
            Id: 38,
            Code: "CC",
            Name: "Cocos (Keeling) Islands",
        },
        {
            Id: 39,
            Code: "CD",
            Name: "Congo - Kinshasa",
        },
        {
            Id: 40,
            Code: "CF",
            Name: "Central African Republic",
        },
        {
            Id: 41,
            Code: "CG",
            Name: "Congo - Brazzaville",
        },
        {
            Id: 42,
            Code: "CH",
            Name: "Switzerland",
        },
        {
            Id: 43,
            Code: "CI",
            Name: "Ivory Coast",
        },
        {
            Id: 44,
            Code: "CK",
            Name: "Cook Islands",
        },
        {
            Id: 45,
            Code: "CL",
            Name: "Chile",
        },
        {
            Id: 46,
            Code: "CM",
            Name: "Cameroon",
        },
        {
            Id: 47,
            Code: "CN",
            Name: "China",
        },
        {
            Id: 48,
            Code: "CO",
            Name: "Colombia",
        },
        {
            Id: 49,
            Code: "CR",
            Name: "Costa Rica",
        },
        {
            Id: 50,
            Code: "CU",
            Name: "Cuba",
        },
        {
            Id: 51,
            Code: "CV",
            Name: "Cape Verde",
        },
        {
            Id: 52,
            Code: "CX",
            Name: "Christmas Island",
        },
        {
            Id: 53,
            Code: "CY",
            Name: "Cyprus",
        },
        {
            Id: 54,
            Code: "CZ",
            Name: "Czech Republic",
        },
        {
            Id: 55,
            Code: "DE",
            Name: "Germany",
        },
        {
            Id: 56,
            Code: "DJ",
            Name: "Djibouti",
        },
        {
            Id: 57,
            Code: "DK",
            Name: "Denmark",
        },
        {
            Id: 58,
            Code: "DM",
            Name: "Dominica",
        },
        {
            Id: 59,
            Code: "DO",
            Name: "Dominican Republic",
        },
        {
            Id: 60,
            Code: "DZ",
            Name: "Algeria",
        },
        {
            Id: 61,
            Code: "EC",
            Name: "Ecuador",
        },
        {
            Id: 62,
            Code: "EE",
            Name: "Estonia",
        },
        {
            Id: 63,
            Code: "EG",
            Name: "Egypt",
        },
        {
            Id: 64,
            Code: "ER",
            Name: "Eritrea",
        },
        {
            Id: 65,
            Code: "ES",
            Name: "Spain",
        },
        {
            Id: 66,
            Code: "ET",
            Name: "Ethiopia",
        },
        {
            Id: 67,
            Code: "FI",
            Name: "Finland",
        },
        {
            Id: 68,
            Code: "FJ",
            Name: "Fiji",
        },
        {
            Id: 69,
            Code: "FK",
            Name: "Falkland Islands (Islas Malvinas)",
        },
        {
            Id: 70,
            Code: "FM",
            Name: "Micronesia",
        },
        {
            Id: 71,
            Code: "FO",
            Name: "Faroe Islands",
        },
        {
            Id: 72,
            Code: "FR",
            Name: "France",
        },
        {
            Id: 73,
            Code: "GA",
            Name: "Gabon",
        },
        {
            Id: 74,
            Code: "GB",
            Name: "United Kingdom",
        },
        {
            Id: 75,
            Code: "GD",
            Name: "Grenada",
        },
        {
            Id: 76,
            Code: "GE",
            Name: "Georgia",
        },
        {
            Id: 77,
            Code: "GG",
            Name: "Guernsey",
        },
        {
            Id: 78,
            Code: "GF",
            Name: "French Guiana",
        },
        {
            Id: 79,
            Code: "GH",
            Name: "Ghana",
        },
        {
            Id: 80,
            Code: "GI",
            Name: "Gibraltar",
        },
        {
            Id: 81,
            Code: "GL",
            Name: "Greenland",
        },
        {
            Id: 82,
            Code: "GM",
            Name: "Gambia",
        },
        {
            Id: 83,
            Code: "GN",
            Name: "Guinea",
        },
        {
            Id: 84,
            Code: "GP",
            Name: "Guadeloupe",
        },
        {
            Id: 85,
            Code: "GQ",
            Name: "Equatorial Guinea",
        },
        {
            Id: 86,
            Code: "GR",
            Name: "Greece",
        },
        {
            Id: 87,
            Code: "GS",
            Name: "South Georgia & South Sandwich Islands",
        },
        {
            Id: 88,
            Code: "GT",
            Name: "Guatemala",
        },
        {
            Id: 89,
            Code: "GU",
            Name: "Guam",
        },
        {
            Id: 90,
            Code: "GW",
            Name: "Guinea-Bissau",
        },
        {
            Id: 91,
            Code: "GY",
            Name: "Guyana",
        },
        {
            Id: 92,
            Code: "HK",
            Name: "Hong Kong",
        },
        {
            Id: 93,
            Code: "HN",
            Name: "Honduras",
        },
        {
            Id: 94,
            Code: "HR",
            Name: "Croatia",
        },
        {
            Id: 95,
            Code: "HT",
            Name: "Haiti",
        },
        {
            Id: 96,
            Code: "HU",
            Name: "Hungary",
        },
        {
            Id: 97,
            Code: "ID",
            Name: "Indonesia",
        },
        {
            Id: 98,
            Code: "IE",
            Name: "Ireland",
        },
        {
            Id: 99,
            Code: "IL",
            Name: "Israel",
        },
        {
            Id: 100,
            Code: "IM",
            Name: "Isle of Man",
        },
        {
            Id: 101,
            Code: "IN",
            Name: "India",
        },
        {
            Id: 102,
            Code: "IO",
            Name: "British Indian Ocean Territory",
        },
        {
            Id: 103,
            Code: "IQ",
            Name: "Iraq",
        },
        {
            Id: 104,
            Code: "IR",
            Name: "Iran",
        },
        {
            Id: 105,
            Code: "IS",
            Name: "Iceland",
        },
        {
            Id: 106,
            Code: "IT",
            Name: "Italy",
        },
        {
            Id: 107,
            Code: "JE",
            Name: "Jersey",
        },
        {
            Id: 108,
            Code: "JM",
            Name: "Jamaica",
        },
        {
            Id: 109,
            Code: "JO",
            Name: "Jordan",
        },
        {
            Id: 110,
            Code: "JP",
            Name: "Japan",
        },
        {
            Id: 111,
            Code: "KE",
            Name: "Kenya",
        },
        {
            Id: 112,
            Code: "KG",
            Name: "Kyrgyzstan",
        },
        {
            Id: 113,
            Code: "KH",
            Name: "Cambodia",
        },
        {
            Id: 114,
            Code: "KI",
            Name: "Kiribati",
        },
        {
            Id: 115,
            Code: "KM",
            Name: "Comoros",
        },
        {
            Id: 116,
            Code: "KN",
            Name: "Saint Kitts and Nevis",
        },
        {
            Id: 117,
            Code: "KP",
            Name: "Korea (Democratic People's Republic of)",
        },
        {
            Id: 118,
            Code: "KR",
            Name: "Korea (Republic of)",
        },
        {
            Id: 119,
            Code: "KW",
            Name: "Kuwait",
        },
        {
            Id: 120,
            Code: "KY",
            Name: "Cayman Islands",
        },
        {
            Id: 121,
            Code: "KZ",
            Name: "Kazakhstan",
        },
        {
            Id: 122,
            Code: "LB",
            Name: "Lebanon",
        },
        {
            Id: 123,
            Code: "LC",
            Name: "Saint Lucia",
        },
        {
            Id: 124,
            Code: "LI",
            Name: "Liechtenstein",
        },
        {
            Id: 125,
            Code: "LK",
            Name: "Sri Lanka",
        },
        {
            Id: 126,
            Code: "LR",
            Name: "Liberia",
        },
        {
            Id: 127,
            Code: "LS",
            Name: "Lesotho",
        },
        {
            Id: 128,
            Code: "LT",
            Name: "Lithuania",
        },
        {
            Id: 129,
            Code: "LU",
            Name: "Luxembourg",
        },
        {
            Id: 130,
            Code: "LV",
            Name: "Latvia",
        },
        {
            Id: 131,
            Code: "LY",
            Name: "Libya",
        },
        {
            Id: 132,
            Code: "MA",
            Name: "Morocco",
        },
        {
            Id: 133,
            Code: "MC",
            Name: "Monaco",
        },
        {
            Id: 134,
            Code: "MD",
            Name: "Moldova",
        },
        {
            Id: 135,
            Code: "ME",
            Name: "Montenegro",
        },
        {
            Id: 136,
            Code: "MG",
            Name: "Madagascar",
        },
        {
            Id: 137,
            Code: "MH",
            Name: "Marshall Islands",
        },
        {
            Id: 138,
            Code: "MK",
            Name: "Macedonia",
        },
        {
            Id: 139,
            Code: "ML",
            Name: "Mali",
        },
        {
            Id: 140,
            Code: "MM",
            Name: "Myanmar (Burma)",
        },
        {
            Id: 141,
            Code: "MN",
            Name: "Mongolia",
        },
        {
            Id: 142,
            Code: "MO",
            Name: "Macao",
        },
        {
            Id: 143,
            Code: "MP",
            Name: "Northern Mariana Islands",
        },
        {
            Id: 144,
            Code: "MQ",
            Name: "Martinique",
        },
        {
            Id: 145,
            Code: "MR",
            Name: "Mauritania",
        },
        {
            Id: 146,
            Code: "MS",
            Name: "Montserrat",
        },
        {
            Id: 147,
            Code: "MT",
            Name: "Malta",
        },
        {
            Id: 148,
            Code: "MU",
            Name: "Mauritius",
        },
        {
            Id: 149,
            Code: "MV",
            Name: "Maldives",
        },
        {
            Id: 150,
            Code: "MW",
            Name: "Malawi",
        },
        {
            Id: 151,
            Code: "MX",
            Name: "Mexico",
        },
        {
            Id: 152,
            Code: "MY",
            Name: "Malaysia",
        },
        {
            Id: 153,
            Code: "MZ",
            Name: "Mozambique",
        },
        {
            Id: 154,
            Code: "NA",
            Name: "Namibia",
        },
        {
            Id: 155,
            Code: "NC",
            Name: "New Caledonia",
        },
        {
            Id: 156,
            Code: "NE",
            Name: "Niger",
        },
        {
            Id: 157,
            Code: "NF",
            Name: "Norfolk Island",
        },
        {
            Id: 158,
            Code: "NG",
            Name: "Nigeria",
        },
        {
            Id: 159,
            Code: "NI",
            Name: "Nicaragua",
        },
        {
            Id: 160,
            Code: "NL",
            Name: "Netherlands",
        },
        {
            Id: 161,
            Code: "NO",
            Name: "Norway",
        },
        {
            Id: 162,
            Code: "NP",
            Name: "Nepal",
        },
        {
            Id: 163,
            Code: "NR",
            Name: "Nauru",
        },
        {
            Id: 164,
            Code: "NU",
            Name: "Niue",
        },
        {
            Id: 165,
            Code: "NZ",
            Name: "New Zealand",
        },
        {
            Id: 166,
            Code: "OM",
            Name: "Oman",
        },
        {
            Id: 167,
            Code: "PA",
            Name: "Panama",
        },
        {
            Id: 168,
            Code: "PE",
            Name: "Peru",
        },
        {
            Id: 169,
            Code: "PF",
            Name: "French Polynesia",
        },
        {
            Id: 170,
            Code: "PG",
            Name: "Papua New Guinea",
        },
        {
            Id: 171,
            Code: "PH",
            Name: "Philippines",
        },
        {
            Id: 172,
            Code: "PK",
            Name: "Pakistan",
        },
        {
            Id: 173,
            Code: "PL",
            Name: "Poland",
        },
        {
            Id: 174,
            Code: "PM",
            Name: "Saint Pierre and Miquelon",
        },
        {
            Id: 175,
            Code: "PN",
            Name: "Pitcairn Islands",
        },
        {
            Id: 176,
            Code: "PR",
            Name: "Puerto Rico",
        },
        {
            Id: 177,
            Code: "PT",
            Name: "Portugal",
        },
        {
            Id: 178,
            Code: "PW",
            Name: "Palau",
        },
        {
            Id: 179,
            Code: "PY",
            Name: "Paraguay",
        },
        {
            Id: 180,
            Code: "QA",
            Name: "Qatar",
        },
        {
            Id: 181,
            Code: "RO",
            Name: "Romania",
        },
        {
            Id: 182,
            Code: "RS",
            Name: "Serbia",
        },
        {
            Id: 183,
            Code: "RU",
            Name: "Russia",
        },
        {
            Id: 184,
            Code: "RW",
            Name: "Rwanda",
        },
        {
            Id: 185,
            Code: "SA",
            Name: "Saudi Arabia",
        },
        {
            Id: 186,
            Code: "SB",
            Name: "Solomon Islands",
        },
        {
            Id: 187,
            Code: "SC",
            Name: "Seychelles",
        },
        {
            Id: 188,
            Code: "SD",
            Name: "Sudan",
        },
        {
            Id: 189,
            Code: "SE",
            Name: "Sweden",
        },
        {
            Id: 190,
            Code: "SG",
            Name: "Singapore",
        },
        {
            Id: 191,
            Code: "SH",
            Name: "Saint Helena",
        },
        {
            Id: 192,
            Code: "SI",
            Name: "Slovenia",
        },
        {
            Id: 193,
            Code: "SJ",
            Name: "Svalbard",
        },
        {
            Id: 194,
            Code: "SK",
            Name: "Slovakia",
        },
        {
            Id: 195,
            Code: "SL",
            Name: "Sierra Leone",
        },
        {
            Id: 196,
            Code: "SM",
            Name: "San Marino",
        },
        {
            Id: 197,
            Code: "SN",
            Name: "Senegal",
        },
        {
            Id: 198,
            Code: "SO",
            Name: "Somalia",
        },
        {
            Id: 199,
            Code: "SR",
            Name: "Suriname",
        },
        {
            Id: 200,
            Code: "ST",
            Name: "Sao Tome and Principe",
        },
        {
            Id: 201,
            Code: "SV",
            Name: "El Salvador",
        },
        {
            Id: 202,
            Code: "SY",
            Name: "Syria",
        },
        {
            Id: 203,
            Code: "SZ",
            Name: "Swaziland",
        },
        {
            Id: 204,
            Code: "TC",
            Name: "Turks and Caicos Islands",
        },
        {
            Id: 205,
            Code: "TD",
            Name: "Chad",
        },
        {
            Id: 206,
            Code: "TG",
            Name: "Togo",
        },
        {
            Id: 207,
            Code: "TH",
            Name: "Thailand",
        },
        {
            Id: 208,
            Code: "TJ",
            Name: "Tajikistan",
        },
        {
            Id: 209,
            Code: "TK",
            Name: "Tokelau",
        },
        {
            Id: 210,
            Code: "TL",
            Name: "Timor-Leste (East Timor)",
        },
        {
            Id: 211,
            Code: "TM",
            Name: "Turkmenistan",
        },
        {
            Id: 212,
            Code: "TN",
            Name: "Tunisia",
        },
        {
            Id: 213,
            Code: "TO",
            Name: "Tonga",
        },
        {
            Id: 214,
            Code: "TR",
            Name: "Turkey",
        },
        {
            Id: 215,
            Code: "TT",
            Name: "Trinidad and Tobago",
        },
        {
            Id: 216,
            Code: "TV",
            Name: "Tuvalu",
        },
        {
            Id: 217,
            Code: "TW",
            Name: "Taiwan",
        },
        {
            Id: 218,
            Code: "TZ",
            Name: "Tanzania",
        },
        {
            Id: 219,
            Code: "UA",
            Name: "Ukraine",
        },
        {
            Id: 220,
            Code: "UG",
            Name: "Uganda",
        },
        {
            Id: 221,
            Code: "US",
            Name: "United States of America",
        },
        {
            Id: 222,
            Code: "UY",
            Name: "Uruguay",
        },
        {
            Id: 223,
            Code: "UZ",
            Name: "Uzbekistan",
        },
        {
            Id: 224,
            Code: "VA",
            Name: "Vatican City",
        },
        {
            Id: 225,
            Code: "VC",
            Name: "Saint Vincent and the Grenadines",
        },
        {
            Id: 226,
            Code: "VE",
            Name: "Venezuela",
        },
        {
            Id: 227,
            Code: "VG",
            Name: "Virgin Islands",
        },
        {
            Id: 228,
            Code: "VN",
            Name: "Vietnam",
        },
        {
            Id: 229,
            Code: "VU",
            Name: "Vanuatu",
        },
        {
            Id: 230,
            Code: "WF",
            Name: "Wallis and Futuna",
        },
        {
            Id: 231,
            Code: "WS",
            Name: "Samoa",
        },
        {
            Id: 232,
            Code: "XK",
            Name: "Kosovo",
        },
        {
            Id: 233,
            Code: "YE",
            Name: "Yemen",
        },
        {
            Id: 234,
            Code: "YT",
            Name: "Mayotte",
        },
        {
            Id: 235,
            Code: "ZA",
            Name: "South Africa",
        },
        {
            Id: 236,
            Code: "ZM",
            Name: "Zambia",
        },
        {
            Id: 237,
            Code: "ZW",
            Name: "Zimbabwe",
        },
        {
            Id: 238,
            Code: "RE",
            Name: "Réunion",
        },
        {
            Id: 239,
            Code: "AC",
            Name: "Ascension Island",
        },
        {
            Id: 240,
            Code: "BQ",
            Name: "Caribbean Netherlands",
        },
        {
            Id: 241,
            Code: "CW",
            Name: "Curaçao",
        },
        {
            Id: 242,
            Code: "TF",
            Name: "French Southern Territories",
        },
        {
            Id: 243,
            Code: "EH",
            Name: "Western Sahara",
        },
        {
            Id: 244,
            Code: "HM",
            Name: "Heard & McDonald Islands",
        },
        {
            Id: 245,
            Code: "LA",
            Name: "Laos",
        },
        {
            Id: 246,
            Code: "PS",
            Name: "Palestinian Territories",
        },
        {
            Id: 247,
            Code: "MF",
            Name: "Saint Martin (French part)",
        },
        {
            Id: 248,
            Code: "SX",
            Name: "Sint Maarten",
        },
        {
            Id: 249,
            Code: "SS",
            Name: "South Sudan",
        },
        {
            Id: 250,
            Code: "TA",
            Name: "Tristan da Cunha",
        },
        {
            Id: 251,
            Code: "BL",
            Name: "St. Barthélemy",
        },
        {
            Id: 252,
            Code: "UM",
            Name: "U.S. Outlying Islands",
        },
        {
            Id: 253,
            Code: "VI",
            Name: "Virgin Islands (US)",
        },
    ],
    Total: 253,
}
