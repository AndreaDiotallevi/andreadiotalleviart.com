import { getParameterValue } from "./ssm.getParameterValue"

import {
    CreateConfirmedOrderResponse,
    CreateEmbryonicOrderResponse,
} from "../types/theprintspace"

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
