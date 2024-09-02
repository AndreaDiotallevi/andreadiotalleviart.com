import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { getCurrencyForIp } from "../actions/freeipapi.getCurrencyForIp"

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
        body: JSON.stringify({ currency }),
        headers: {
            "Access-Control-Allow-Headers":
                "Content-Type, X-Api-Key, X-Forwarded-For",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
