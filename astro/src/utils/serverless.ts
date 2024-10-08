import Stripe from "stripe"
import type { Currency, StripePrice } from "./stripe"

export const getStripePrices = async (): Promise<StripePrice[]> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/stripe-get-prices`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )

        if (response.ok) {
            const data = (await response.json()) as {
                prices: StripePrice[]
            }
            return data.prices
        } else {
            throw new Error(JSON.stringify(response))
        }
    } catch (error) {
        throw error
    }
}

export const createCheckoutSession = async (params: {
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
    success_url: string
    currency: Currency
}): Promise<Stripe.Checkout.Session | null> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/stripe-create-checkout-session`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            },
        )

        if (response.ok) {
            const data = (await response.json()) as {
                session: Stripe.Checkout.Session
            }
            return data.session
        } else {
            console.error(JSON.stringify(response))
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export const retrieveCheckoutSession = async (params: {
    sessionId: string
}): Promise<Stripe.Checkout.Session | null> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL +
                `/stripe-retrieve-checkout-session/${params.sessionId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )

        if (response.ok) {
            const data = (await response.json()) as {
                session: Stripe.Checkout.Session
            }
            return data.session
        } else {
            console.error(JSON.stringify(response))
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getLocaleCurrency = async (): Promise<Currency> => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/get-locale-currency`,
            {
                method: "GET",
            },
        )

        if (response.ok) {
            const data = (await response.json()) as { currency: Currency }
            return data.currency
        } else {
            console.error(JSON.stringify(response))
            return "gbp"
        }
    } catch (error) {
        console.error(error)
        return "gbp"
    }
}
