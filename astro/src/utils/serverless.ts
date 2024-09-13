import Stripe from "stripe"

export const createCheckoutSession = async (params: {
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
    success_url: string
}) => {
    if (!import.meta.env.PUBLIC_API_KEY) {
        throw new Error("The api key is undefined.")
    }

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

export const getLocaleCurrency = async () => {
    try {
        const response = await fetch(
            import.meta.env.PUBLIC_API_URL + `/get-locale-currency`,
            {
                method: "GET",
            },
        )

        if (response.ok) {
            const data = (await response.json()) as { currency: string }
            return data.currency
        } else {
            console.error("Failed to get locale currency")
            return "GBP"
        }
    } catch (error) {
        console.error("Error during request: ", error)
        return "GBP"
    }
}
