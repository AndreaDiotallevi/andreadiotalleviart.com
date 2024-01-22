import { SQSEvent, SQSRecord } from "aws-lambda"

import Stripe from "stripe"

import { sendEmail } from "../data"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)

            const stripeEvent = body.detail as Stripe.Event

            // if (stripeEvent.type !== 'checkout.session.completed') {
            //     // Do something
            // }

            const sessionId = stripeEvent.data.object.id
            const { error } = await sendEmail({ sessionId })

            if (error) {
                console.log("Error processing SQS event record")
                console.error(error)

                throw new Error("Could not process SQS event record")
            }
        }
    } catch (error) {
        console.log("Error processing SQS event")
        console.error(error)

        throw new Error("Could not process SQS event")
    }
}
