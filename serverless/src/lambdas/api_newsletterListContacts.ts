import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { newsletterListContacts } from "../actions/ses_listContacts"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { contacts } = await newsletterListContacts()

    return {
        statusCode: 200,
        body: JSON.stringify({ contacts }),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
