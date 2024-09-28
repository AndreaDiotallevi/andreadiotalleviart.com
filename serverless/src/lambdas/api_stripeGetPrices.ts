import { APIGatewayProxyResult } from "aws-lambda"

import { getPrices } from "../actions/stripe_getPrices"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    const prices = await getPrices()
    console.log(JSON.stringify(prices))

    return {
        statusCode: 200,
        body: JSON.stringify({ prices }),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
