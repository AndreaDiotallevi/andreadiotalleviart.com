import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import { sendEmail } from "../services/ses"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)
            const stripeEvent = body.detail as Stripe.Event
            const sessionId = stripeEvent.data.object.id
            const { error } = await sendEmail({ sessionId })

            if (error) {
                console.error(error)

                throw new Error("Could not process SQS event record")
            }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
