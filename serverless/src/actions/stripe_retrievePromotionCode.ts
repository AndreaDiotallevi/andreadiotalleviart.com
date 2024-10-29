import Stripe from "stripe"
import { initialiseClient } from "./stripe_initialiseClient"

export const retrievePromotionCode = async (params: {
    code: string
}): Promise<{ promotionCode?: Stripe.PromotionCode; error?: string }> => {
    try {
        const stripe = await initialiseClient()

        const { code } = params

        console.log("Retrieving promotion code...")

        const promotionCodes = await stripe.promotionCodes.list({
            code,
        })

        if (promotionCodes.data.length === 0) {
            return { error: "This promotion code is invalid." }
        }

        return { promotionCode: promotionCodes.data[0] }
    } catch (error) {
        return {
            error: "There was a problem with your request. Please try again.",
        }
    }
}
