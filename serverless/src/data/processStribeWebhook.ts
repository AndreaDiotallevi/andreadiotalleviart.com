import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge"
import Stripe from "stripe"

const ssmClient = new SSMClient({ region: process.env.AWS_REGION })
const eventBridgeClient = new EventBridgeClient({
    region: process.env.AWS_REGION,
})

export const processStripeWebhook = async ({
    stripeEvent,
}: {
    stripeEvent: Stripe.Event
}) => {
    try {
        console.log(stripeEvent)

        const putEventsCommand = new PutEventsCommand({
            Entries: [
                {
                    Source: "stripe",
                    DetailType: "CheckoutSessionCompleted",
                    Detail: JSON.stringify(stripeEvent),
                    EventBusName: process.env.EVENT_BUS_NAME,
                },
            ],
        })

        const response = await eventBridgeClient.send(putEventsCommand)

        return {
            entries: response.Entries,
        }
    } catch (error) {
        console.log("Error processing stripe webhook")
        console.error(error)
        const errorMessage = "Could not process stripe webhook"

        return {
            error: errorMessage,
        }
    }

    // const getParameterCommand = new GetParameterCommand({
    //     Name: "STRIPE_SECRET_KEY",
    // })
    // const { Parameter } = await ssmClient.send(getParameterCommand)
    // const secretValue = Parameter?.Value as string
    // const stripe = new Stripe(secretValue, {
    //     apiVersion: "2023-10-16",
    // })
    // try {
    //     const session = await stripe.checkout.sessions.retrieve(sessionId, {
    //         expand: ["customer"],
    //     })
    //     console.log(session)
    //     return {
    //         session,
    //     }
    // } catch (error) {
    //     console.log("Error creating session")
    //     console.log(error)
    //     const errorMessage = "Could not create session"
    //     return {
    //         error: errorMessage,
    //     }
    // }
}
