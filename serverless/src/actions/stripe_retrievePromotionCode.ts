import { initialiseClient } from "./stripe_initialiseClient"

export const retrievePromotionCode = async (params: { code: string }) => {
    try {
        const stripe = await initialiseClient()

        const { code } = params

        const promotionCodes = await stripe.promotionCodes.list({
            code,
        })

        if (promotionCodes.data.length === 0) {
            throw new Error("Promotion code not found")
        }

        return promotionCodes.data[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}
