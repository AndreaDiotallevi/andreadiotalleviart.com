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

        console.log(JSON.stringify(session))

        if (process.env.ENVIRONMENT !== "production") {
            // Required until Creativehub updates the SSL certificate for the sandbox API environment (which has expired)
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
        }

        const { orderId, deliveryOptions } = await createEmbryonicOrder({
            session,
        })

        await createConfirmedOrder({ orderId, deliveryOptions })
    }
}
