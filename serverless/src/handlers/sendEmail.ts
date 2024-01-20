import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { sendEmail } from "../data"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { error } = await sendEmail()

    const statusCode = error ? 500 : 200

    const body = error ? JSON.stringify({ error }) : JSON.stringify("OK")

    return {
        statusCode,
        body,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
