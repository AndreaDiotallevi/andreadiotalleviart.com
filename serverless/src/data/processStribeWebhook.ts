import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge"
import Stripe from "stripe"

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
}
