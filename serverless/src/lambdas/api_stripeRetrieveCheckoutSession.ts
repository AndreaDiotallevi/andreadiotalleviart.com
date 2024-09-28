import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const sessionId = event.pathParameters?.sessionId as string

    const { session } = await retrieveCheckoutSession({ sessionId })

    console.log(JSON.stringify(session))

    return {
        statusCode: 200,
        body: JSON.stringify({ session }),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
