import Stripe from "stripe"
import { getParameterValue } from "./ssm"

const fileName = "flames-A3.png"

export const createOrder = async ({
    customerDetails,
    shippingDetails,
    lineItems,
}: {
    customerDetails: Stripe.Checkout.Session["customer_details"]
    shippingDetails: Stripe.Checkout.Session["shipping_details"]
    lineItems: Stripe.Checkout.Session["line_items"]
}) => {
    try {
        if (!shippingDetails?.address) {
            throw new Error("No shipping details")
        }
        if (!customerDetails) {
            throw new Error("No customer details")
        }
        if (!lineItems) {
            throw new Error("No line items")
        }

        // 3507x4960px

        const prodigiApiKey = await getParameterValue<string>({
            name: "PRODIGI_API_KEY",
        })

        const url = `${process.env.PRODIGI_URL}/v4.0/Orders/`

        const requestBody = {
            merchantReference: "TBC",
            shippingMethod: "Standard",
            recipient: {
                address: {
                    line1: shippingDetails.address.line1,
                    line2: shippingDetails.address.line2 || null,
                    postalOrZipCode: shippingDetails.address.postal_code,
                    countryCode: shippingDetails.address.country,
                    townOrCity: shippingDetails.address.city,
                    stateOrCounty: shippingDetails.address.state || null, // Empty string breaks it
                },
                name: customerDetails.name + "7",
            },
            items: lineItems.data.map(item => ({
                merchantReference: "TBC",
                sku: "GLOBAL-HPR-A3", // Hahnemühle Photo Rag, 29.7x42 cm / 11.7x16.5" (A3)
                copies: item.quantity,
                sizing: "fillPrintArea",
                assets: [
                    {
                        printArea: "Default",
                        url: `https://${process.env.BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
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
            throw new Error("Failed to create order")
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
