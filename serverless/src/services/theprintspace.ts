import Stripe from "stripe"

import { getParameterValue } from "./ssm"

import {
    getCountryIdFromCountryCode,
    getCountryNameFromCountryCode,
} from "../data/theprintspace"

import {
    CreateConfirmedOrderResponse,
    CreateEmbryonicOrderResponse,
    GetAllProductsResponse,
} from "../types/theprintspace"

import { ProductWithMetadata } from "../types/stripe"

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
                FirstName: customer_details?.name,
                LastName: "/",
                Email: customer_details?.email,
                MessageToLab: null,
                ShippingAddress: {
                    FirstName: customer_details?.name,
                    LastName: "/",
                    Line1: shipping_details?.address?.line1,
                    Line2: shipping_details?.address?.line2,
                    Town: shipping_details?.address?.city,
                    County: shipping_details?.address?.state,
                    PostCode: shipping_details?.address?.postal_code,
                    CountryId: getCountryIdFromCountryCode(
                        shipping_details?.address?.country || ""
                    ),
                    CountryCode: shipping_details?.address?.country,
                    CountryName: getCountryNameFromCountryCode(
                        shipping_details?.address?.country || ""
                    ),
                    PhoneNumber: null,
                },
                OrderItems: line_items?.data.map(item => {
                    const product = item.price
                        ?.product as unknown as ProductWithMetadata

                    return {
                        ProductId: product.metadata.theprintspaceProductId,
                        PrintOptionId:
                            product.metadata.theprintspacePrintOptionId,
                        Quantity: item.quantity,
                        ExternalReference: product.metadata.sku,
                        ExternalSku: product.metadata.sku,
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

export const createConfirmedOrder = async ({
    orderId,
    deliveryOptions,
}: {
    orderId: number
    deliveryOptions: CreateEmbryonicOrderResponse["DeliveryOptions"]
}) => {
    const creativehubApiKey = await getParameterValue<string>({
        name: "CREATIVEHUB_API_KEY",
        withDecryption: true,
    })

    const deliveryOption = deliveryOptions.reduce((min, option) =>
        option.DeliveryChargeExcludingSalesTax <
        min.DeliveryChargeExcludingSalesTax
            ? option
            : min
    )

    const response = await fetch(
        `${process.env.CREATIVEHUB_API_URL}/api/v1/orders/confirmed`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `ApiKey ${creativehubApiKey}`,
            },
            body: JSON.stringify({
                OrderId: orderId,
                DeliveryOptionId: deliveryOption.Id,
            }),
        }
    )

    const data = (await response.json()) as CreateConfirmedOrderResponse
    console.log("CreateConfirmedOrderResponse: ", JSON.stringify(data))

    if (!response.ok) {
        console.error(response)
        throw new Error("Failed to create a confirmed order with theprintspace")
    }

    return "OK"
}

export const getAllProducts = async () => {
    const creativehubApiKey = await getParameterValue<string>({
        name: "CREATIVEHUB_API_KEY",
        withDecryption: true,
    })

    const response = await fetch(
        `${process.env.CREATIVEHUB_API_URL}/api/v1/products/query`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `ApiKey ${creativehubApiKey}`,
            },
        }
    )

    const data = (await response.json()) as GetAllProductsResponse
    console.log("GetAllProductsResponse: ", JSON.stringify(data))

    if (!response.ok) {
        console.error(response)
        throw new Error("Failed to get all products from theprintspace")
    }

    return data
}
