import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { Currency } from "../types/stripe"
import { createCheckoutSession } from "../actions/stripe_createCheckoutSession"
import { retrievePromotionCode } from "../actions/stripe_retrievePromotionCode"

// Cold start timer: measures time from module init to first invocation
const coldStartLabel = "cold-start:api_stripeCreateCheckoutSession"
console.time(coldStartLabel)
let hasEndedColdStart = false

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (!hasEndedColdStart) {
        console.timeEnd(coldStartLabel)
        hasEndedColdStart = true
    }
    const traceId = `checkout-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`
    console.time(`${traceId}: total`)

    const { line_items, success_url, currency, promotion_code } = JSON.parse(
        event.body as string
    ) as {
        line_items: Stripe.Checkout.SessionCreateParams["line_items"]
        success_url: string
        currency: Currency
        promotion_code?: string
    }

    let error: string | undefined
    let session: Stripe.Checkout.Session | undefined
    let promotionCode: Stripe.PromotionCode | undefined

    if (promotion_code) {
        console.time(`${traceId}: retrievePromotionCode`)
        const response = await retrievePromotionCode({
            code: promotion_code,
        })
        console.timeEnd(`${traceId}: retrievePromotionCode`)

        if (response.error) {
            error = response.error
        } else {
            promotionCode = response.promotionCode
        }
    }

    if (!error) {
        console.time(`${traceId}: createCheckoutSession`)
        const response = await createCheckoutSession({
            line_items,
            success_url,
            currency,
            discounts: promotionCode
                ? [{ promotion_code: promotionCode.id }]
                : undefined,
        })
        console.timeEnd(`${traceId}: createCheckoutSession`)

        if (response.error) {
            error = response.error
        } else {
            session = response.session
        }
    }

    const statusCode = error ? 500 : 200
    const body = error ? JSON.stringify({ error }) : JSON.stringify({ session })

    console.timeEnd(`${traceId}: total`)
    return {
        statusCode,
        body,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
