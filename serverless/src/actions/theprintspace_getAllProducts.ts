import { getParameterValue } from "./ssm_getParameterValue"

import { GetAllProductsResponse } from "../types/theprintspace"

export const getAllProducts = async () => {
    const creativehubApiKey = await getParameterValue<string>({
        name: "CREATIVEHUB_API_KEY",
        withDecryption: true,
    })

    console.log("Fetching products from Theprintspace...")
    console.log(process.env.CREATIVEHUB_API_URL)
    console.log(`ApiKey ${creativehubApiKey}`)
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
    console.log(response)

    const data = (await response.json()) as GetAllProductsResponse
    console.log("GetAllProductsResponse: ", JSON.stringify(data))

    if (!response.ok) {
        console.log("5555")
        console.error(response)
        throw new Error("Failed to get all products from theprintspace")
    }

    return data
}
