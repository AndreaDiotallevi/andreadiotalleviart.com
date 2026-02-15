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

        const toSummary = (session: Stripe.Checkout.Session): CheckoutSessionSummary => {
            return {
                id: session.id,
                created: session.created,
                status: session.status,
                payment_status: session.payment_status,
                customer_email: session.customer_details?.email ?? session.customer_email,
                amount_total: session.amount_total,
                currency: session.currency,
            }
        }

        const sessionsMap = new Map<string, CheckoutSessionSummary>()
        for (const session of [
            ...openSessionsResponse.data,
            ...completedSessionsResponse.data,
        ]) {
            sessionsMap.set(session.id, toSummary(session))
        }

        const sessions = Array.from(sessionsMap.values())
            .sort((a, b) => b.created - a.created)
            .slice(0, limit)

        return { sessions }
    } catch (error) {
        console.error(error)
        throw error
    }
}
