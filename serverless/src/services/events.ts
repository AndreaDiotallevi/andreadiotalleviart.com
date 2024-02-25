import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge"
import Stripe from "stripe"

const eventBridgeClient = new EventBridgeClient({
    region: process.env.AWS_REGION,
})

export const putEvent = async ({
    stripeEvent,
}: {
    stripeEvent: Stripe.Event
}) => {
    try {
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
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}
