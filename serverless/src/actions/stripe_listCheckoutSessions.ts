import Stripe from "stripe"

import { initialiseClient } from "./stripe_initialiseClient"

export type CheckoutSessionLineItemSummary = Pick<
    Stripe.LineItem,
    "id" | "description" | "quantity" | "amount_total" | "currency"
>

export type CheckoutSessionSummary = Pick<
    Stripe.Checkout.Session,
    | "id"
    | "created"
    | "livemode"
    | "status"
    | "payment_status"
    | "customer_email"
    | "amount_subtotal"
    | "amount_total"
    | "currency"
> & {
    amount_discount: number | null
    line_items: CheckoutSessionLineItemSummary[]
}

export const listCheckoutSessions = async (params?: {
    limit?: number
}): Promise<{
    sessions: CheckoutSessionSummary[]
}> => {
    try {
        const stripe = await initialiseClient()
        const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100)

        const completedSessionsResponse = await stripe.checkout.sessions.list({
            limit,
            status: "complete",
        })

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
                livemode: session.livemode,
                status: session.status,
                payment_status: session.payment_status,
                customer_email: session.customer_details?.email ?? session.customer_email,
                amount_subtotal: session.amount_subtotal,
                amount_total: session.amount_total,
                currency: session.currency,
                amount_discount: session.total_details?.amount_discount ?? null,
                line_items: lineItems.map(toLineItemSummary),
            }
        }

        const selectedSessions = completedSessionsResponse.data
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
