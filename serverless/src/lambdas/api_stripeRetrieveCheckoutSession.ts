import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const sessionId = event.pathParameters?.sessionId as string

    const { session, error } = await retrieveCheckoutSession({ sessionId })

    console.log(JSON.stringify(session))

    const statusCode = error ? 500 : 200
    const body = error ? JSON.stringify({ error }) : JSON.stringify({ session })

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
