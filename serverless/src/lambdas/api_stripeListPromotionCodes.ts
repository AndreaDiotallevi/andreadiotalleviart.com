import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { listPromotionCodes } from "../actions/stripe_listPromotionCodes"

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
        const { promotionCodes } = await listPromotionCodes()

        return {
            statusCode: 200,
            body: JSON.stringify({ promotionCodes }),
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
    } catch (error) {
        console.error("Failed to list promotion codes", error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to list promotion codes" }),
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
    }
}
