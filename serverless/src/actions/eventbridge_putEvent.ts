import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge"
import Stripe from "stripe"

const eventBridgeClient = new EventBridgeClient({
    region: process.env.AWS_REGION,
})

export const putEvent = async ({
    source,
    detailType,
    event,
}: {
    source: "stripe"
    detailType: Stripe.Event["type"]
    event: Stripe.Event
}) => {
    try {
        const putEventsCommand = new PutEventsCommand({
            Entries: [
                {
                    Source: source,
                    DetailType: detailType,
                    Detail: JSON.stringify(event),
                    EventBusName: process.env.EVENT_BUS_NAME,
                },
            ],
        })

        return await eventBridgeClient.send(putEventsCommand)
    } catch (error) {
        console.error(error)
        throw error
    }
}
