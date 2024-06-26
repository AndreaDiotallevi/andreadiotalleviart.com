import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { createCheckoutSession } from "../services/stripe"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { line_items, success_url } = JSON.parse(
        event.body as string
    ) as Stripe.Checkout.SessionCreateParams

    if (!line_items) {
        throw new Error("No line items")
    }

    if (!success_url) {
        throw new Error("No success url")
    }

    const { session } = await createCheckoutSession({
        line_items,
        success_url,
    })

    console.log(JSON.stringify(session))

    return {
        statusCode: 200,
        body: JSON.stringify({ session }),
        headers: {
            "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
