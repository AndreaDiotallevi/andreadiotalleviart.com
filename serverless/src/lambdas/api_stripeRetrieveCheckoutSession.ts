import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const sessionId = event.pathParameters?.sessionId as string

    const { session, error } = await retrieveCheckoutSession({ sessionId })

    console.log(JSON.stringify(session))

    // Map known errors to appropriate HTTP status codes
    const statusCode = error
        ? error === "Session is expired"
            ? 410 // Gone
            : 400 // Bad Request for other known validation errors
        : 200
    const body = error ? JSON.stringify({ error }) : JSON.stringify({ session })

    console.log("API response...")
    console.log(body)

    return {
        statusCode,
        body,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
