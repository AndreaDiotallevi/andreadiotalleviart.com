import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { isAuthorisedAdminRequest } from "../actions/admin_authorise"
import {
    FulfilmentLine,
    getCreativehubItems,
    getDeliveryFromSession,
    getFulfilmentBlockers,
    getFulfilmentLines,
    isPaymentRefunded,
} from "../actions/fulfilment"
import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"
import {
    CreativehubApiError,
    findOrderByExternalReference,
    getOrder,
    quoteOrder,
} from "../actions/theprintspace_client"

const jsonResponse = (
    statusCode: number,
    body: unknown,
): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Content-Type": "application/json",
    },
})

const summariseSession = (session: Stripe.Checkout.Session) => ({
    id: session.id,
    created: session.created,
    livemode: session.livemode,
    status: session.status,
    paymentStatus: session.payment_status,
    currency: session.currency,
    amountSubtotal: session.amount_subtotal,
    amountDiscount: session.total_details?.amount_discount ?? 0,
    amountTotal: session.amount_total,
    orderNumber: session.metadata?.orderNumber ?? null,
    refunded: isPaymentRefunded(session),
    customer: {
        name: session.customer_details?.name ?? null,
        email: session.customer_details?.email ?? null,
        phone: session.customer_details?.phone ?? null,
    },
    shipping: {
        name: session.shipping_details?.name ?? null,
        address: session.shipping_details?.address ?? null,
    },
})

const errorMessageFromBody = (body: unknown): string | null => {
    if (!body || typeof body !== "object") return null
    const record = body as Record<string, unknown>
    if (typeof record.message === "string") return record.message
    if (typeof record.detail === "string") return record.detail
    if (typeof record.error_code === "string") return record.error_code
    return null
}

export const handler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    if (!isAuthorisedAdminRequest(event)) {
        return jsonResponse(401, { error: "Unauthorized" })
    }

    const sessionId = event.pathParameters?.sessionId
    if (!sessionId) {
        return jsonResponse(400, { error: "Missing session id" })
    }

    const { session, error } = await retrieveCheckoutSession({ sessionId })
    if (!session) {
        return jsonResponse(404, {
            error: error ?? "Checkout session not found",
        })
    }

    const lines: FulfilmentLine[] = getFulfilmentLines(session)
    const blockers = getFulfilmentBlockers({
        session,
        environment: process.env.ENVIRONMENT,
        lines,
    })

    let creativehubOrder: unknown = null
    let creativehubError: string | null = null
    try {
        const existing = await findOrderByExternalReference(session.id)
        const orderId = existing?.id ?? existing?.order_id
        if (existing && orderId) {
            creativehubOrder = await getOrder(orderId)
        }
    } catch (caught) {
        console.error(caught)
        creativehubError =
            caught instanceof CreativehubApiError
                ? (errorMessageFromBody(caught.body) ??
                  `CreativeHub error ${caught.status}`)
                : "Could not reach CreativeHub"
    }

    let quote: Record<string, unknown> | null = null
    let quoteError: string | null = null
    const delivery = getDeliveryFromSession(session)
    const canQuote =
        creativehubOrder === null &&
        delivery !== null &&
        lines.length > 0 &&
        lines.every(line => line.variantId !== null)

    if (canQuote && delivery) {
        try {
            quote = await quoteOrder({
                items: getCreativehubItems(lines),
                deliveryCountryCode: delivery.delivery_country_code,
            })
        } catch (caught) {
            console.error(caught)
            quoteError =
                caught instanceof CreativehubApiError
                    ? (errorMessageFromBody(caught.body) ??
                      `CreativeHub error ${caught.status}`)
                    : "Could not get a CreativeHub quote"
        }
    }

    const alreadyOrdered = creativehubOrder !== null

    return jsonResponse(200, {
        session: summariseSession(session),
        lines,
        creativehubOrder,
        creativehubError,
        quote,
        quoteError,
        canOrder:
            !alreadyOrdered &&
            creativehubError === null &&
            blockers.length === 0,
        blockers,
    })
}
