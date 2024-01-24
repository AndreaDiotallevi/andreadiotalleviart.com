import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { createCheckoutSession } from "../data"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { line_items, cancel_url, success_url } = JSON.parse(
        event.body as string
    ) as Stripe.Checkout.SessionCreateParams

    const { session, error } = await createCheckoutSession({
        line_items,
        cancel_url,
        success_url,
    })

    const statusCode = error ? 500 : 200

    const body = error ? JSON.stringify({ error }) : JSON.stringify({ session })

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
