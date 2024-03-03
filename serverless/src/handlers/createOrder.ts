import { EventBridgeEvent } from "aws-lambda"
import Stripe from "stripe"

import { createOrder } from "../services/prodigi"
import { createPresignedUrl } from "../services/s3"
import { retrieveCheckoutSession } from "../services/stripe"

export const handler = async (
    event: EventBridgeEvent<"CheckoutSessionCompleted", Stripe.Event>
) => {
    const { session } = await retrieveCheckoutSession({
        sessionId: event.detail.data.object.id,
    })

    console.log(session.customer_details)
    console.log(session.shipping_details)
    console.log(session.line_items?.data)

    const { url } = await createPresignedUrl()

    await createOrder({
        customerDetails: session.customer_details,
        shippingDetails: session.shipping_details,
        lineItems: session.line_items,
        imageUrl: url,
    })
}
