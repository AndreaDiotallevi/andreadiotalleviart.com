import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
})

export async function getActivePrices() {
    const prices = await stripe.prices.list({
        active: true,
        expand: ["data.product"],
    })

    return prices.data as StripePrice[]
}

const stripePriceSchema = z.object({
    id: z.string(),
    object: z.literal("price"),
    active: z.boolean(),
    currency: z.string(),
    unit_amount: z.number(),
    product: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
    }),
})

export type StripePrice = z.infer<typeof stripePriceSchema>
