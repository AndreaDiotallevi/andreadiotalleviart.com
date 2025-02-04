import { APIGatewayProxyResult } from "aws-lambda"

import { getProducts } from "../actions/stripe_getProducts"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    const products = await getProducts()

    return {
        statusCode: 200,
        body: JSON.stringify({ products }),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            // "Cache-Control": "public, max-age=120",
            // "Content-Type": "application/json",
        },
    }
}
