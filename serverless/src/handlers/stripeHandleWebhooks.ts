import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"

import { putEvent } from "../services/events"
import { getParameterValue } from "../services/ssm"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const stripeSigningSecret = await getParameterValue<string>({
            name: "STRIPE_SIGNING_SECRET",
        })

        const { body, headers } = event
        console.log(JSON.stringify(body))

        const stripeSignatureHeader = headers["Stripe-Signature"]

        const stripeEvent = Stripe.webhooks.constructEvent(
            body || "",
            stripeSignatureHeader || "",
            stripeSigningSecret
        )

        const { Entries } = await putEvent({
            source: "stripe",
            detailType: stripeEvent.type,
            event: stripeEvent,
        })

        return {
            statusCode: 200,
            body: JSON.stringify(Entries),
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
