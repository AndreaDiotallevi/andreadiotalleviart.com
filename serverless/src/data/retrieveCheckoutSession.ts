import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import Stripe from "stripe"

const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

export const retrieveCheckoutSession = async (params: {
    sessionId: string
}) => {
    const getParameterCommand = new GetParameterCommand({
        Name: "STRIPE_SECRET_KEY",
    })

    const { Parameter } = await ssmClient.send(getParameterCommand)
    const secretValue = Parameter?.Value as string

    const stripe = new Stripe(secretValue, {
        apiVersion: "2023-10-16",
    })

    const { sessionId } = params

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "line_items.data.price.product", "customer"],
        })

        return {
            session,
        }
    } catch (error) {
        console.log("Error retrieving session")
        console.error(error)
        const errorMessage = "Could not retrieve session"

        return {
            error: errorMessage,
        }
    }
}
