import Stripe from "stripe"

import { createPresignedUrl } from "../data"

export type CreatePresignedUrlResponse = {
    url: string
}

export const handler = async (event: {
    detail: Stripe.Event
}): Promise<CreatePresignedUrlResponse> => {
    console.log(event.detail)

    const { url } = await createPresignedUrl()

    return {
        url,
    }
}
