import { initialiseClient } from "./stripe_initialiseClient"

export const retrieveCheckoutSession = async (params: {
    sessionId: string
}) => {
    try {
        const stripe = await initialiseClient()

        const { sessionId } = params

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: [
                "line_items",
                "line_items.data.price.product",
                "customer",
                "invoice",
                "invoice.charge",
                "total_details.breakdown.discounts", // https://docs.stripe.com/api/checkout/sessions/object#checkout_session_object-total_details-breakdown-discounts-discount
            ],
        })

        return {
            session,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
