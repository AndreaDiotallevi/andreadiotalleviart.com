import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { newsletterCreateContact } from "../actions/ses_createContact"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { email } = JSON.parse(event.body as string) as { email: string }
    await newsletterCreateContact({ email })

    return {
        statusCode: 200,
        body: JSON.stringify("OK"),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
