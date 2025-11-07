import type Stripe from "stripe"
import type { Currency, StripeProduct } from "./stripe"

export const getStripeProducts = async (): Promise<StripeProduct[]> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/products`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )

        if (response.ok) {
            const data = (await response.json()) as {
                products: StripeProduct[]
            }
            return data.products
        } else {
            console.error(response)
            return []
        }
    } catch (error) {
        console.error(error)
        return []
    }
}

export const createCheckoutSession = async (params: {
    line_items: Stripe.Checkout.SessionCreateParams["line_items"]
    success_url: string
    currency: Currency
    promotion_code?: string
}): Promise<{ session?: Stripe.Checkout.Session; error?: string }> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/sessions`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            }
        )

        const { session, error } = (await response.json()) as {
            session?: Stripe.Checkout.Session
            error?: string
        }

        return { session, error }
    } catch (error) {
        return {
            error: "There was a problem with your request. Please try again.",
        }
    }
}

export const retrieveCheckoutSession = async (params: {
    sessionId: string
}): Promise<{ session?: Stripe.Checkout.Session; error?: string }> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/sessions/${params.sessionId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )

        const { session, error } = (await response.json()) as {
            session?: Stripe.Checkout.Session
            error?: string
        }

        return { session, error }
    } catch (error) {
        return {
            error: "There was a problem with your request. Please try again.",
        }
    }
}

export const newsletterCreateContact = async (params: {
    email: string
}): Promise<{ success?: boolean; error?: string }> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/contacts`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            }
        )

        const { success, error } = (await response.json()) as {
            success: boolean
            error?: string
        }

        return { success, error }
    } catch (error) {
        return {
            success: false,
            error: "Unknown error.",
        }
    }
}
