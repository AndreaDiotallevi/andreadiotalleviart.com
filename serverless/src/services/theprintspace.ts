import Stripe from "stripe"
import { getParameterValue } from "./ssm"
import {
    getCountryIdFromCountryCode,
    getCountryNameFromCountryCode,
} from "../data/theprintspace"

export const createEmbryonicOrder = async ({
    session,
}: {
    session: Stripe.Checkout.Session
}) => {
    try {
        const { shipping_details, customer_details, line_items, id } = session

        if (!shipping_details?.address) {
            throw new Error("No shipping details")
        }
        if (!shipping_details.address.country) {
            throw new Error("No shipping address country")
        }
        if (!customer_details) {
            throw new Error("No customer details")
        }
        if (!line_items) {
            throw new Error("No line items")
        }

        const creativehubApiKey = await getParameterValue<string>({
            name: "CREATIVEHUB_API_KEY",
            withDecryption: true,
        })

        if (!creativehubApiKey) {
            throw new Error("No Creativehub API key")
        }

        const url = `${process.env.CREATIVEHUB_API_URL}/api/v1/orders/embryonic`

        const requestBody = {
            ExternalReference: "",
            FirstName: customer_details.name,
            LastName: "",
            Email: customer_details.email,
            MessageToLab: "",
            ShippingAddress: {
                FirstName: customer_details.name,
                LastName: "",
                Line1: shipping_details.address.line1,
                Line2: shipping_details.address.line2,
                Town: shipping_details.address.city,
                County: shipping_details.address.state,
                PostCode: shipping_details.address.postal_code,
                CountryId: getCountryIdFromCountryCode(
                    shipping_details.address.country
                ),
                CountryCode: shipping_details.address.country,
                CountryName: getCountryNameFromCountryCode(
                    shipping_details.address.country
                ),
                PhoneNumber: null,
            },
            OrderItems: line_items.data.map(item => ({
                ProductId: 36026,
                PrintOptionId: 4175,
                Quantity: item.quantity,
                ExternalReference: item.price?.product.metadata.sku,
                ExternalSku: "",
            })),
        }

        console.log(JSON.stringify(requestBody))

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `ApiKey ${creativehubApiKey}`,
            },
            body: JSON.stringify(requestBody),
        }

        const response = await fetch(url, options)

        if (!response.ok) {
            console.error(response.body)
            console.log(response.status, response.statusText)
            throw new Error("Failed to create order with theprintspace")
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
