import Stripe from "stripe"

import { getParameterValue } from "./ssm_getParameterValue"

import { ProductWithMetadata, StripePrice } from "../types/stripe"
import { CreateEmbryonicOrderResponse } from "../types/theprintspace"
import { getCountryFromCountryCode } from "./theprintspace_getCountryFromCountryCode"

export const createEmbryonicOrder = async ({
    session,
}: {
    session: Stripe.Checkout.Session
}) => {
    const { shipping_details, customer_details, line_items, id } = session

    const creativehubApiKey = await getParameterValue<string>({
        name: "CREATIVEHUB_API_KEY",
        withDecryption: true,
    })

    const country = getCountryFromCountryCode(
        shipping_details?.address?.country
    )

    const response = await fetch(
        `${process.env.CREATIVEHUB_API_URL}/api/v1/orders/embryonic`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `ApiKey ${creativehubApiKey}`,
            },
            body: JSON.stringify({
                ExternalReference: id,
                FirstName: shipping_details?.name,
                LastName: "*",
                Email: customer_details?.email,
                MessageToLab: null,
                ShippingAddress: {
                    FirstName: shipping_details?.name,
                    LastName: "*",
                    Line1: shipping_details?.address?.line1,
                    Line2: shipping_details?.address?.line2,
                    Town: shipping_details?.address?.city,
                    County: shipping_details?.address?.state,
                    PostCode: shipping_details?.address?.postal_code,
                    CountryId: country.Id,
                    CountryCode: shipping_details?.address?.country,
                    CountryName: country.Name,
                    PhoneNumber: null,
                },
                OrderItems: line_items?.data.map(item => {
                    const {
                        metadata: {
                            sku,
                            displayName,
                            theprintspaceProductId,
                            theprintspacePrintOptionId,
                        },
                    } = item.price?.product as unknown as StripePrice["product"]

                    return {
                        ProductId: theprintspaceProductId,
                        PrintOptionId: theprintspacePrintOptionId,
                        Quantity: item.quantity,
                        ExternalReference: displayName,
                        ExternalSku: sku,
                    }
                }),
            }),
        }
    )

    const data = (await response.json()) as CreateEmbryonicOrderResponse
    console.log("CreateEmbryonicOrderResponse: ", JSON.stringify(data))

    if (!response.ok) {
        console.error(response)
        throw new Error(
            "Failed to create an embryonic order with theprintspace"
        )
    }

    return { orderId: data.Id, deliveryOptions: data.DeliveryOptions }
}
