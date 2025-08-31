import { StripeProduct } from "../types/stripe"
import { initialiseClient } from "./stripe_initialiseClient"

export async function getProducts(): Promise<StripeProduct[]> {
    const stripe = await initialiseClient()

    console.log("Getting Stripe products...")
    const response = await stripe.products.list({
        active: true,
        expand: ["data.default_price", "data.default_price.currency_options"],
    })

    return response.data.filter(product => product.metadata.category == "prints") as unknown as StripeProduct[]
}
