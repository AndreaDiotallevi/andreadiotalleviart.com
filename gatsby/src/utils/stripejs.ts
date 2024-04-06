/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { loadStripe, Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>

const getStripe = () => {
    if (!process.env.GATSBY_STRIPE_PUBLISHABLE_KEY) {
        throw new Error(
            "GATSBY_STRIPE_PUBLISHABLE_KEY environment variable is undefined"
        )
    }

    if (!stripePromise) {
        stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)
    }

    return stripePromise
}

export default getStripe
