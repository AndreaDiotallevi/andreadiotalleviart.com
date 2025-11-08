import { initialiseClient } from "./stripe_initialiseClient"
import Stripe from "stripe"

export const cleanupCheckoutSessionsWithInactivePrices = async (): Promise<{
    scanned: number
    expired: number
}> => {
    const stripe = await initialiseClient()

    let startingAfter: string | undefined = undefined
    let scanned = 0
    let expired = 0

    // Iterate through all open (non-expired/non-completed) sessions
    // Note: Stripe paginates results; we loop until no more pages.
    // We intentionally scope to status=open to avoid touching completed/expired sessions.
    // https://stripe.com/docs/api/checkout/sessions/list
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const sessions: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
            status: "open",
            limit: 100,
            starting_after: startingAfter,
        })

        for (const session of sessions.data) {
            scanned += 1

            // List line items and expand price to check active flag
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                limit: 100,
                expand: ["data.price"],
            })

            const hasInactivePrice = lineItems.data.some(item => {
                const price = item.price as any
                return price && price.active === false
            })

            if (hasInactivePrice) {
                try {
                    await stripe.checkout.sessions.expire(session.id)
                    expired += 1
                } catch (e) {
                    // Non-fatal: log and continue scanning other sessions
                    console.error(`Failed to expire session ${session.id}`, e)
                }
            }
        }

        if (!sessions.has_more) break
        startingAfter = sessions.data[sessions.data.length - 1]?.id
        if (!startingAfter) break
    }

    console.log(
        `Checkout sessions cleanup completed. Scanned=${scanned}, expired=${expired}`,
    )
    return { scanned, expired }
}
