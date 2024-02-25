import { EventBridgeEvent } from "aws-lambda"
import Stripe from "stripe"

import { createPresignedUrl } from "../services/s3"

export type CreatePresignedUrlResponse = {
    url: string
}

export const handler = async (
    event: EventBridgeEvent<"CheckoutSessionCompleted", Stripe.Event>
): Promise<CreatePresignedUrlResponse> => {
    console.log(event)
    const { url } = await createPresignedUrl()

    return {
        url,
    }
}
