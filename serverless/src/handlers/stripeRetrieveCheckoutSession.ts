import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { retrieveCheckoutSession } from "../services/stripe"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const sessionId = event.pathParameters?.sessionId as string

    const { session } = await retrieveCheckoutSession({ sessionId })

    // const statusCode = error ? 500 : 200

    // const body = error ? JSON.stringify({ error }) : JSON.stringify({ session })

    return {
        statusCode: 200,
        body: JSON.stringify({ session }),
        headers: {
            "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}