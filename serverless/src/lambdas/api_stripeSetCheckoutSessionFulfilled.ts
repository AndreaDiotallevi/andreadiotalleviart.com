import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { setCheckoutSessionFulfilled } from "../actions/stripe_setCheckoutSessionFulfilled"

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

    const sessionId = event.pathParameters?.sessionId
    if (!sessionId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing session id" }),
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
    }

    const { success, error } = await setCheckoutSessionFulfilled({ sessionId })

    if (!success) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error ?? "Failed to set fulfilled metadata" }),
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
}
