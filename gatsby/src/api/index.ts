import Stripe from "stripe"

export const createCheckoutSession = async (
    params: Pick<
        Stripe.Checkout.SessionCreateParams,
        "line_items" | "success_url"
    >
) => {
    if (!process.env.GATSBY_API_KEY) {
        throw new Error("The api key is undefined.")
    }

    try {
        const response = await fetch(
            process.env.GATSBY_API_URL + `/create-checkout-session`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": process.env.GATSBY_API_KEY,
                },
                body: JSON.stringify(params),
            }
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
    if (!process.env.GATSBY_API_KEY) {
        throw new Error("The api key is undefined.")
    }

    try {
        const response = await fetch(
            process.env.GATSBY_API_URL +
                `/retrieve-checkout-session/${params.sessionId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": process.env.GATSBY_API_KEY,
                },
            }
        )

        if (response.ok) {
            const data = (await response.json()) as {
                session: Stripe.Checkout.Session
            }
            return data.session
        } else {
            console.error(
                "Failed to retrieve checkout session: ",
                response.statusText
            )
            return null
        }
    } catch (error) {
        console.error("Error during request: ", error)
        return null
    }
}
