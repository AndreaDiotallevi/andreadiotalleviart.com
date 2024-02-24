import Stripe from "stripe"

import { sendEmail } from "../data"

export const handler = async (event: {
    detail: Stripe.Event
}): Promise<void> => {
    try {
        // if (stripeEvent.type !== 'checkout.session.completed') {
        //     // Do something
        // }

        const sessionId = event.detail.data.object.id
        const { error } = await sendEmail({ sessionId })

        if (error) {
            console.error(error)

            throw new Error("Could not process SQS event record")
        }
    } catch (error) {
        console.error(error)

        throw error
    }
}
