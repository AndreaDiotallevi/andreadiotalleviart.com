import { StripePrice } from "../types/stripe"
import { initialiseClient } from "./stripe_initialiseClient"

export async function getPrices(): Promise<StripePrice[]> {
    const stripe = await initialiseClient()

    const response = await stripe.prices.list({
        active: true,
        expand: ["data.product", "data.currency_options"],
    })

    const allPrices = response.data as unknown as StripePrice[]

    return allPrices.filter(
        price => price.product.active && price.product.metadata.slug
    )
}
