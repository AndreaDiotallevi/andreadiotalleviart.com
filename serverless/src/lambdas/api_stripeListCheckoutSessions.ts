import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { listCheckoutSessions } from "../actions/stripe_listCheckoutSessions"

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

    try {
        const { sessions } = await listCheckoutSessions()

        return {
            statusCode: 200,
            body: JSON.stringify({ sessions }),
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
    } catch (error) {
        console.error("Failed to list checkout sessions", error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to list checkout sessions" }),
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
    }
}
