import Stripe from "stripe"

import { initialiseClient } from "./stripe_initialiseClient"

export type CheckoutSessionSummary = Pick<
    Stripe.Checkout.Session,
    "id" | "created" | "status" | "payment_status" | "customer_email" | "amount_total" | "currency"
>

export const listCheckoutSessions = async (params?: {
    limit?: number
}): Promise<{
    sessions: CheckoutSessionSummary[]
}> => {
    try {
        const stripe = await initialiseClient()
        const limit = Math.min(Math.max(params?.limit ?? 100, 1), 100)

        const response = await stripe.checkout.sessions.list({
            limit,
            status: "complete",
        })
        const sessions = response.data
            .map((session): CheckoutSessionSummary => {
                return {
                    id: session.id,
                    created: session.created,
                    status: session.status,
                    payment_status: session.payment_status,
                    customer_email: session.customer_details?.email ?? session.customer_email,
                    amount_total: session.amount_total,
                    currency: session.currency,
                }
            })
            .sort((a, b) => b.created - a.created)

        return { sessions }
    } catch (error) {
        console.error(error)
        throw error
    }
}
