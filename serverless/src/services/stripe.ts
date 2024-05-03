import Stripe from "stripe"

import { getParameterValue } from "./ssm"
import { products } from "../data/stripe"

const initialiseStripeClient = async () => {
    const stripeSecretKey = await getParameterValue<string>({
        name: "STRIPE_SECRET_KEY",
        withDecryption: true,
    })

    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
    })

    return stripe
}

export const createCheckoutSession = async (
    params: Pick<
        Stripe.Checkout.SessionCreateParams,
        "line_items" | "success_url"
    >
) => {
    try {
        const stripe = await initialiseStripeClient()

        const { line_items, success_url } = params

        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded",
            mode: "payment",
            return_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
            line_items,
            allow_promotion_codes: true,
            shipping_address_collection: {
                allowed_countries: countriesArray,
            },
        })

        return {
            session,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const retrieveCheckoutSession = async (params: {
    sessionId: string
}) => {
    try {
        const stripe = await initialiseStripeClient()

        const { sessionId } = params

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: [
                "line_items",
                "line_items.data.price.product",
                "customer",
                "total_details.breakdown.discounts", // https://docs.stripe.com/api/checkout/sessions/object#checkout_session_object-total_details-breakdown-discounts-discount
            ],
        })

        return {
            session,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const stripeSynchroniseProducts = async () => {
    try {
        const stripe = await initialiseStripeClient()

        const stripeProducts = await stripe.products.list()

        for (const product of products) {
            const { name } = product

            const payload = {
                name: product.name,
                description: product.description,
                metadata: product.metadata,
            }

            // const stripeProduct = stripeProducts.data.find(
            //     p => p.metadata.sku === sku
            // )

            const stripeProduct = stripeProducts.data.find(p => p.name === name)

            if (stripeProduct) {
                await stripe.products.update(stripeProduct.id, payload)
            } else {
                // await stripe.products.create(payload)
            }
        }

        console.log("Products synchronized successfully!")
    } catch (error) {
        console.error(error)
        throw error
    }
}

const countriesArray: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
    [
        "AC",
        "AD",
        "AE",
        "AF",
        "AG",
        "AI",
        "AL",
        "AM",
        "AO",
        "AQ",
        "AR",
        "AT",
        "AU",
        "AW",
        "AX",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BL",
        "BM",
        "BN",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BT",
        "BV",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CV",
        "CW",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "EH",
        "ER",
        "ES",
        "ET",
        "FI",
        "FJ",
        "FK",
        "FO",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GF",
        "GG",
        "GH",
        "GI",
        "GL",
        "GM",
        "GN",
        "GP",
        "GQ",
        "GR",
        "GS",
        "GT",
        "GU",
        "GW",
        "GY",
        "HK",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IM",
        "IN",
        "IO",
        "IQ",
        "IS",
        "IT",
        "JE",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KR",
        "KW",
        "KY",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MF",
        "MG",
        "MK",
        "ML",
        "MM",
        "MN",
        "MO",
        "MQ",
        "MR",
        "MS",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NC",
        "NE",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NU",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PF",
        "PG",
        "PH",
        "PK",
        "PL",
        "PM",
        "PN",
        "PR",
        "PS",
        "PT",
        "PY",
        "QA",
        "RE",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SE",
        "SG",
        "SH",
        "SI",
        "SJ",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SX",
        "SZ",
        "TA",
        "TC",
        "TD",
        "TF",
        "TG",
        "TH",
        "TJ",
        "TK",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "UG",
        "US",
        "UY",
        "UZ",
        "VA",
        "VC",
        "VE",
        "VG",
        "VN",
        "VU",
        "WF",
        "WS",
        "XK",
        "YE",
        "YT",
        "ZA",
        "ZM",
        "ZW",
        "ZZ",
    ]

// const products: Array<
//     Pick<Stripe.Product, "name" | "description"> & {
//         metadata: {
//             category: "prints"
//             slug: "marble-lake" | "flames" | "moonlight-2" | "new-york"
//             size: "A1" | "A2" | "A3"
//             prodigiSku: "GLOBAL-HPR-A1" | "GLOBAL-HPR-A2" | "GLOBAL-HPR-A3"
//             displayName: string
//             orientation: "portrait" | "landscape"
//             displayOrder: string
//         }
//     }
// > = [
