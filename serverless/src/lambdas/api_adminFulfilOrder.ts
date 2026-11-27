import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { isAuthorisedAdminRequest } from "../actions/admin_authorise"
import {
    getCreativehubItems,
    getDeliveryFromSession,
    getFulfilmentBlockers,
    getFulfilmentLines,
} from "../actions/fulfilment"
import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"
import {
    CreativehubApiError,
    createOrder,
    findOrderByExternalReference,
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

const creativehubErrorResponse = (
    caught: CreativehubApiError,
): APIGatewayProxyResult => {
    const body = (caught.body ?? {}) as Record<string, unknown>
    const message =
        typeof body.message === "string"
            ? body.message
            : typeof body.detail === "string"
              ? body.detail
              : "CreativeHub rejected the order."
    const statusCode =
        caught.status === 409 || caught.status === 422 ? caught.status : 502

    return jsonResponse(statusCode, {
        error:
            typeof body.error_code === "string"
                ? body.error_code
                : "creativehub_error",
        message,
        creativehubStatus: caught.status,
    })
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

    const lines = getFulfilmentLines(session)
    const blockers = getFulfilmentBlockers({
        session,
        environment: process.env.ENVIRONMENT,
        lines,
    })

    if (blockers.length > 0) {
        return jsonResponse(409, { error: "not_allowed", blockers })
    }

    const delivery = getDeliveryFromSession(session)
    if (!delivery) {
        return jsonResponse(409, {
            error: "not_allowed",
            blockers: ["No shipping address on this checkout."],
        })
    }

    try {
        const existing = await findOrderByExternalReference(session.id)
        if (existing) {
            return jsonResponse(409, {
                error: "already_ordered",
                message: "This checkout already has a CreativeHub order.",
                orderNumber: existing.order_number ?? null,
            })
        }
    } catch (caught) {
        console.error(caught)
        return jsonResponse(502, {
            error: "lookup_failed",
            message:
                "Could not check CreativeHub for an existing order. Nothing was placed.",
        })
    }

    try {
        const order = await createOrder({
            items: getCreativehubItems(lines),
            delivery,
            externalReference: session.id,
            idempotencyKey: `fulfil-${session.id}`,
        })

        console.log(
            `Placed CreativeHub order ${order.order_number} for ${session.id}`,
        )

        return jsonResponse(201, {
            orderId: order.order_id,
            orderNumber: order.order_number,
            externalReference: order.external_reference,
        })
    } catch (caught) {
        console.error(caught)
        if (caught instanceof CreativehubApiError) {
            return creativehubErrorResponse(caught)
        }
        return jsonResponse(502, {
            error: "creativehub_unreachable",
            message:
                "Could not reach CreativeHub. Nothing was confirmed; check the order list before retrying.",
        })
    }
}
