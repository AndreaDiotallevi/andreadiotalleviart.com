import { getParameterValue } from "./ssm.getParameterValue"

import { GetAllProductsResponse } from "../types/theprintspace"

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