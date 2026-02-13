import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { newsletterListContacts } from "../actions/ses_listContacts"

const corsHeaders = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
}

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const adminSecret = process.env.ADMIN_API_SECRET
    const providedSecret =
        event.headers?.["X-Admin-Secret"] ?? event.headers?.["x-admin-secret"]
    if (!adminSecret || providedSecret !== adminSecret) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Unauthorized" }),
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
    }

    const { contacts } = await newsletterListContacts()

    return {
        statusCode: 200,
        body: JSON.stringify({ contacts }),
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
}
