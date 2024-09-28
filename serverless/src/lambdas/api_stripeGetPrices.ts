import { APIGatewayProxyResult } from "aws-lambda"

import { getPrices } from "../actions/stripe_getPrices"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    const prices = await getPrices()

    return {
        statusCode: 200,
        body: JSON.stringify({ prices }),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            // "Cache-Control": "public, max-age=120",
            // "Content-Type": "application/json",
        },
    }
}
