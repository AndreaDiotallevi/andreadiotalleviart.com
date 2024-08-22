import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import {
    createConfirmedOrder,
    createEmbryonicOrder,
} from "../services/theprintspace"
import { retrieveCheckoutSession } from "../services/stripe"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)
            const event = body.detail as Stripe.CheckoutSessionCompletedEvent
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
    } catch (error) {
        console.error(error)
        throw error
    }
}
