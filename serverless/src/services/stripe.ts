import Stripe from "stripe"

import { putEvent } from "./events"
import { getParameterValue } from "./ssm"

export const createCheckoutSession = async (
    params: Pick<
        Stripe.Checkout.SessionCreateParams,
        "line_items" | "success_url"
    >
) => {
    const stripeSecretKey = await getParameterValue<string>({
        name: "STRIPE_SECRET_KEY",
    })

    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
    })

    const { line_items, success_url } = params

    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded",
            mode: "payment",
            return_url: `${success_url}/success?session_id={CHECKOUT_SESSION_ID}`,
            line_items,
            allow_promotion_codes: true,
            shipping_address_collection: { allowed_countries: ["GB"] },
        })

        return {
            session,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const retrieveCheckoutSession = async (params: {
    sessionId: string
}) => {
    const stripeSecretKey = await getParameterValue<string>({
        name: "STRIPE_SECRET_KEY",
    })

    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
    })

    const { sessionId } = params

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "line_items.data.price.product", "customer"],
        })

        return {
            session,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const processStripeWebhook = async ({
    stripeEvent,
}: {
    stripeEvent: Stripe.Event
}) => {
    try {
        console.log(stripeEvent)

        const response = await putEvent({ stripeEvent })

        return {
            entries: response.Entries,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
