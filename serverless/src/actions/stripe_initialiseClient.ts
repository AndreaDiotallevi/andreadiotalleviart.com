import Stripe from "stripe"

import { getParameterValue } from "./ssm_getParameterValue"

export const initialiseClient = async () => {
    const stripeSecretKey = await getParameterValue<string>({
        name: "STRIPE_SECRET_KEY",
        withDecryption: true,
    })

    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2024-06-20",
    })

    return stripe
}
