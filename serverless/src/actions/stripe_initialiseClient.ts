import Stripe from "stripe"

import { getParameterValue } from "./ssm_getParameterValue"

let stripeClientPromise: Promise<Stripe> | undefined

export const initialiseClient = async () => {
    if (stripeClientPromise) {
        return stripeClientPromise
    }

    stripeClientPromise = (async () => {
        const stripeSecretKey = await getParameterValue<string>({
            name: "STRIPE_SECRET_KEY",
            withDecryption: true,
        })

        return new Stripe(stripeSecretKey, {
            apiVersion: "2024-06-20",
        })
    })()

    try {
        return await stripeClientPromise
    } catch (error) {
        stripeClientPromise = undefined
        throw error
    }
}
