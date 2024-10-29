import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { Currency } from "../types/stripe"
import { createCheckoutSession } from "../actions/stripe_createCheckoutSession"
import { retrievePromotionCode } from "../actions/stripe_retrievePromotionCode"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
        const response = await retrievePromotionCode({
            code: promotion_code,
        })

        if (response.error) {
            error = response.error
        } else {
            promotionCode = response.promotionCode
        }
    }

    if (!error) {
        const response = await createCheckoutSession({
            line_items,
            success_url,
            currency,
            discounts: promotionCode
                ? [{ promotion_code: promotionCode.id }]
                : undefined,
        })

        if (response.error) {
            error = response.error
        } else {
            session = response.session
        }
    }

    const statusCode = error ? 500 : 200
    const body = error ? JSON.stringify({ error }) : JSON.stringify({ session })

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
