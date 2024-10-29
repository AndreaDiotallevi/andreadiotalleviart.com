import { SQSHandler } from "aws-lambda"
import Stripe from "stripe"

import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"
import { createConfirmedOrder } from "../actions/theprintspace_createConfirmedOrder"
import { createEmbryonicOrder } from "../actions/theprintspace_createEmbryonicOrder"

export const handler: SQSHandler = async (event): Promise<void> => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body) as {
            detail: Stripe.CheckoutSessionCompletedEvent
        }

        const event = body.detail
        const sessionId = event.data.object.id
        const { session } = await retrieveCheckoutSession({ sessionId })

        if (!session) throw new Error("Checkout session not found")

        console.log(JSON.stringify(session))

        const { orderId, deliveryOptions } = await createEmbryonicOrder({
            session,
        })

        await createConfirmedOrder({ orderId, deliveryOptions })
    }
}
