import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { createCheckoutSession } from "../actions/stripe_createCheckoutSession"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { line_items, success_url, currency, promotion_code } = JSON.parse(
        event.body as string
    ) as Stripe.Checkout.SessionCreateParams & { promotion_code?: string }

    if (!line_items) {
        throw new Error("No line items")
    }

    if (!success_url) {
        throw new Error("No success url")
    }

    if (!currency) {
        throw new Error("No currency")
    }

    const { session } = await createCheckoutSession({
        line_items,
        success_url,
        currency,
        promotion_code,
    })

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
