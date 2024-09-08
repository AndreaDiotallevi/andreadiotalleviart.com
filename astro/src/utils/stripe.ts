import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
})

export async function getActivePrices() {
    const response = await stripe.prices.list({
        active: true,
        expand: ["data.product", "data.currency_options"],
    })

    const allPrices = response.data as unknown as StripePrice[]

    return allPrices.filter(
        price => price.product.active && price.product.metadata.slug,
    )
}

const stripePriceSchema = z.object({
    id: z.string(),
    object: z.literal("price"),
    active: z.boolean(),
    currency: z.string(),
    unit_amount: z.number(),
    product: z.object({
        id: z.string(),
        active: z.boolean(),
        name: z.string(),
        description: z.string(),
        images: z.array(z.string()),
        metadata: z.object({
            category: z.string(),
            displayName: z.string(),
            displayOrder: z.string(),
            orientation: z.string(),
            size: z.string(),
            slug: z.string(),
            sku: z.string(),
            theprintspacePrintOptionId: z.string(),
            theprintspaceProductId: z.string(),
        }),
    }),
})

export type StripePrice = z.infer<typeof stripePriceSchema>

export const createCheckoutSession = async (params: {
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
    success_url: string
}) => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/stripe-create-checkout-session`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": import.meta.env.PUBLIC_API_KEY,
                },
                body: JSON.stringify(params),
            },
        )

        if (response.ok) {
            const data = (await response.json()) as {
                session: Stripe.Checkout.Session
            }
            return data
        } else {
            throw new Error("Failed to create checkout session")
        }
    } catch (error) {
        console.error("Error during request: ", error)
        return null
    }
}

export const retrieveCheckoutSession = async (params: {
    sessionId: string
}) => {
    if (!import.meta.env.PUBLIC_API_KEY) {
        throw new Error("The api key is undefined.")
    }

    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL +
                `/stripe-retrieve-checkout-session/${params.sessionId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": import.meta.env.PUBLIC_API_KEY,
                },
            },
        )

        if (response.ok) {
            const data = (await response.json()) as {
                session: Stripe.Checkout.Session
            }
            return data.session
        } else {
            console.error(
                "Failed to retrieve checkout session: ",
                response.statusText,
            )
            return null
        }
    } catch (error) {
        console.error("Error during request: ", error)
        return null
    }
}
