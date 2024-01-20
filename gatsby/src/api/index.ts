import Stripe from "stripe"

export const createCheckoutSession = async (
    params: Pick<
        Stripe.Checkout.SessionCreateParams,
        "line_items" | "cancel_url" | "success_url"
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
                sessionId: string
            }
            return data.sessionId
        } else {
            console.error("Failed to get access token: ", response.statusText)
            return null
        }
    } catch (error) {
        console.error("Error during request: ", error)
        return null
    }
}
