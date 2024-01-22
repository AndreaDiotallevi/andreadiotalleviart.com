import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import Stripe from "stripe"

const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

export const processStripeWebhook = async ({
    sessionId,
}: {
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

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["customer"],
        })

        console.log(session)

        return {
            session,
        }
    } catch (error) {
        console.log("Error creating session")
        console.log(error)
        const errorMessage = "Could not create session"

        return {
            error: errorMessage,
        }
    }
}
