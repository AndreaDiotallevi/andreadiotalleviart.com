import Stripe from "stripe"
import { initialiseClient } from "./stripe_initialiseClient"

export const retrievePromotionCode = async (params: {
    code: string
}): Promise<{ promotionCode?: Stripe.PromotionCode; error?: string }> => {
    try {
        const stripe = await initialiseClient()

        const { code } = params

        const promotionCodes = await stripe.promotionCodes.list({
            code,
        })

        if (promotionCodes.data.length === 0) {
            return { error: "Promotion code not found" }
        }

        return { promotionCode: promotionCodes.data[0] }
    } catch (error) {
        return { error: "Something went wrong" }
    }
}
