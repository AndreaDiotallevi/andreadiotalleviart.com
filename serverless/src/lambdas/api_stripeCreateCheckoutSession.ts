import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { createCheckoutSession } from "../actions/stripe_createCheckoutSession"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const {
        line_items,
        success_url,
        currency = "gbp",
    } = JSON.parse(event.body as string) as Stripe.Checkout.SessionCreateParams

    if (!line_items) {
        throw new Error("No line items")
    }

    if (!success_url) {
        throw new Error("No success url")
    }

    const { session } = await createCheckoutSession({
        line_items,
        success_url,
        currency: currency,
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
