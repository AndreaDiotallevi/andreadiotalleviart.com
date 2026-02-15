import Stripe from "stripe"

import { initialiseClient } from "./stripe_initialiseClient"

export type CheckoutSessionLineItemSummary = Pick<
    Stripe.LineItem,
    "id" | "description" | "quantity" | "amount_total" | "currency"
>

export type CheckoutSessionSummary = Pick<
    Stripe.Checkout.Session,
    "id" | "created" | "status" | "payment_status" | "customer_email" | "amount_total" | "currency"
> & {
    line_items: CheckoutSessionLineItemSummary[]
}

export const listCheckoutSessions = async (params?: {
    limit?: number
}): Promise<{
    sessions: CheckoutSessionSummary[]
}> => {
    try {
        const stripe = await initialiseClient()
        const limit = Math.min(Math.max(params?.limit ?? 100, 1), 100)

        const [openSessionsResponse, completedSessionsResponse] = await Promise.all([
            stripe.checkout.sessions.list({
                limit,
                status: "open",
            }),
            stripe.checkout.sessions.list({
                limit,
                status: "complete",
            }),
        ])

        const toLineItemSummary = (
            lineItem: Stripe.LineItem
        ): CheckoutSessionLineItemSummary => {
            return {
                id: lineItem.id,
                description: lineItem.description,
                quantity: lineItem.quantity,
                amount_total: lineItem.amount_total,
                currency: lineItem.currency,
            }
        }

        const toSummary = (
            session: Stripe.Checkout.Session,
            lineItems: Stripe.LineItem[]
        ): CheckoutSessionSummary => {
            return {
                id: session.id,
                created: session.created,
                status: session.status,
                payment_status: session.payment_status,
                customer_email: session.customer_details?.email ?? session.customer_email,
                amount_total: session.amount_total,
                currency: session.currency,
                line_items: lineItems.map(toLineItemSummary),
            }
        }

        const sessionsMap = new Map<string, Stripe.Checkout.Session>()
        for (const session of [
            ...openSessionsResponse.data,
            ...completedSessionsResponse.data,
        ]) {
            sessionsMap.set(session.id, session)
        }

        const selectedSessions = Array.from(sessionsMap.values())
            .sort((a, b) => b.created - a.created)
            .slice(0, limit)

        const sessions = await Promise.all(
            selectedSessions.map(async (session) => {
                let lineItems: Stripe.LineItem[] = []
                try {
                    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(
                        session.id,
                        {
                            limit: 100,
                        }
                    )
                    lineItems = lineItemsResponse.data
                } catch (error) {
                    console.error(
                        `Failed to list line items for checkout session ${session.id}`,
                        error
                    )
                }

                return toSummary(session, lineItems)
            })
        )

        return { sessions }
    } catch (error) {
        console.error(error)
        throw error
    }
}
