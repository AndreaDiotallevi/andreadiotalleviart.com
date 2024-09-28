import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { getCurrencyForIp } from "../actions/freeipapi_getCurrencyForIp"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event))

    const xForwardedFor =
        event.headers["X-Forwarded-For"] ||
        event.requestContext.identity.sourceIp

    const clientIp = xForwardedFor.split(",")[0].trim()

    const currency = await getCurrencyForIp(clientIp)

    return {
        statusCode: 200,
        body: JSON.stringify({ currency: currency.toLowerCase() }),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            // "Cache-Control": "private, max-age=86400", // Cache for 1 day (86400 seconds)
            // "Content-Type": "application/json",
        },
    }
}
