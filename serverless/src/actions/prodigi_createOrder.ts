import Stripe from "stripe"

import { getParameterValue } from "./ssm_getParameterValue"

export const createOrder = async ({
    session,
}: {
    session: Stripe.Checkout.Session
}) => {
    try {
        const { shipping_details, customer_details, line_items, id } = session

        if (!shipping_details?.address) {
            throw new Error("No shipping details")
        }
        if (!customer_details) {
            throw new Error("No customer details")
        }
        if (!line_items) {
            throw new Error("No line items")
        }

        // 3507x4960px

        const prodigiApiKey = await getParameterValue<string>({
            name: "PRODIGI_API_KEY",
            withDecryption: true,
        })

        if (!prodigiApiKey) {
            throw new Error("No Prodigi API key")
        }

        const imagesDomain = await getParameterValue<string>({
            name: "IMAGES_DOMAIN",
        })

        if (!imagesDomain) {
            throw new Error("No images domain")
        }

        const url = `${process.env.PRODIGI_API_URL}/v4.0/Orders/`

        enum ProdigiShippingMethod {
            Budget = "Budget",
            Standard = "Standard",
            Express = "Express",
            Overnight = "Overnight",
        }

        const countryToShippingMethod: Partial<
            Record<
                Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry,
                ProdigiShippingMethod
            >
        > = {
            GB: ProdigiShippingMethod.Express, // 2 days
            US: ProdigiShippingMethod.Budget,
            IT: ProdigiShippingMethod.Standard, // 5 days
            GR: ProdigiShippingMethod.Standard, // 6 days
        }

        const destinationCountryCode = shipping_details.address.country || ""

        const requestBody = {
            idempotencyKey: id,
            merchantReference: id,
            shippingMethod:
                countryToShippingMethod[destinationCountryCode] ||
                ProdigiShippingMethod.Standard,
            recipient: {
                address: {
                    line1: shipping_details.address.line1,
                    line2: shipping_details.address.line2 || null, // Empty string breaks it
                    postalOrZipCode:
                        shipping_details.address.postal_code ||
                        "[NO POSTAL CODE]", // Empty string or null breaks it
                    countryCode: shipping_details.address.country,
                    townOrCity: shipping_details.address.city,
                    stateOrCounty: shipping_details.address.state || null, // Empty string breaks it
                },
                name: customer_details.name,
                email: customer_details.email,
            },
            items: line_items.data.map(item => ({
                merchantReference: item.price?.product.metadata.sku,
                sku: item.price?.product.metadata.prodigiSku,
                copies: item.quantity,
                sizing: "fillPrintArea",
                assets: [
                    {
                        printArea: "Default",
                        url: `${imagesDomain}/prints/${item.price?.product.metadata.slug}_PRODUCTION_WITHOUT_BORDER.png`,
                    },
                ],
            })),
            metadata: {},
        }

        console.log(JSON.stringify(requestBody))

        const options = {
            method: "POST",
            headers: {
                "X-API-Key": prodigiApiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }

        const response = await fetch(url, options)

        if (!response.ok) {
            console.error(response.body)
            console.log(JSON.stringify(response.status))
            console.log(JSON.stringify(response.statusText))
            throw new Error("Failed to create order")
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
