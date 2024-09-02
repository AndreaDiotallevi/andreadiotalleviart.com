import Stripe from "stripe"

import { getParameterValue } from "./ssm.getParameterValue"

export const initialiseClient = async () => {
    const stripeSecretKey = await getParameterValue<string>({
        name: "STRIPE_SECRET_KEY",
        withDecryption: true,
    })

    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
    })

    return stripe
}
