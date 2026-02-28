import { initialiseClient } from "./stripe_initialiseClient"

export const setCheckoutSessionFulfilled = async (params: {
    sessionId: string
}): Promise<{ success: boolean; error?: string }> => {
    try {
        const sessionId = params.sessionId.trim()
        if (!sessionId) {
            return { success: false, error: "Missing session id" }
        }

        const stripe = await initialiseClient()
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        const metadata = {
            ...(session.metadata ?? {}),
            fulfilled: "true",
        }

        await stripe.checkout.sessions.update(sessionId, {
            metadata,
        })

        return { success: true }
    } catch (error) {
        console.error("Failed to set checkout session fulfilled metadata", error)
        return { success: false, error: "Failed to set fulfilled metadata" }
    }
}
