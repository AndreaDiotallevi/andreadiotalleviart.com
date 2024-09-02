import { SQSHandler } from "aws-lambda"
import Stripe from "stripe"

import { retrieveCheckoutSession } from "../actions/stripe.retrieveCheckoutSession"
import { createConfirmedOrder } from "../actions/theprintspace.createConfirmedOrder"
import { createEmbryonicOrder } from "../actions/theprintspace.createEmbryonicOrder"

export const handler: SQSHandler = async (event): Promise<void> => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body) as {
            detail: Stripe.CheckoutSessionCompletedEvent
        }

        const event = body.detail
        const sessionId = event.data.object.id
        const { session } = await retrieveCheckoutSession({ sessionId })

        console.log(JSON.stringify(session))

        const { orderId, deliveryOptions } = await createEmbryonicOrder({
            session,
        })

        await createConfirmedOrder({ orderId, deliveryOptions })
    }
}
