import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import { createOrder } from "../services/prodigi"
import { retrieveCheckoutSession } from "../services/stripe"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)
            const event = body.detail as Stripe.CheckoutSessionCompletedEvent
            const sessionId = event.data.object.id
            const { session } = await retrieveCheckoutSession({ sessionId })

            console.log(JSON.stringify(session))

            await createOrder({ session })
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
