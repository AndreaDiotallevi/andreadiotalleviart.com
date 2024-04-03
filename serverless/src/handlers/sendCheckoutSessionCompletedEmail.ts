import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import { sendEmail } from "../services/ses"
import { getParameterValue } from "../services/ssm"
import { retrieveCheckoutSession } from "../services/stripe"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)
            const event = body.detail as Stripe.CheckoutSessionCompletedEvent
            console.log(JSON.stringify(event))

            const sessionId = event.data.object.id
            const { session } = await retrieveCheckoutSession({ sessionId })

            if (!session) {
                throw new Error("No session")
            }

            if (!session.customer_details?.email) {
                throw new Error("No customer email")
            }

            const emailSource = await getParameterValue<string>({
                name: "EMAIL_SOURCE",
            })

            if (!session) {
                throw new Error("No session")
            }

            await sendEmail({
                Source: emailSource,
                Destination: {
                    ToAddresses: [session.customer_details.email],
                },
                Template: "CheckoutSessionCompletedEmailTemplate",
                TemplateData: JSON.stringify({
                    name: session.customer_details?.name || "",
                    addressLine1:
                        session.shipping_details?.address?.line1 || "",
                    addressLine2:
                        session.shipping_details?.address?.line2 || "",
                    postcode:
                        session.shipping_details?.address?.postal_code || "",
                    town: session.shipping_details?.address?.city || "",
                    country: session.shipping_details?.address?.country || "",
                    paymentMethod: "Card",
                    productName:
                        session.line_items?.data[0].price?.product.name || "",
                    productDescription:
                        session.line_items?.data[0].price?.product
                            .description || "",
                    itemQuantity: session.line_items?.data[0].quantity || "",
                    amountSubtotal:
                        `£${((session.amount_subtotal || 0) / 100).toFixed(
                            2
                        )}` || "",
                    amountDiscount:
                        `£${(
                            (session.total_details?.amount_discount || 0) / 100
                        ).toFixed(2)}` || "",
                    amountTotal:
                        `£${((session.amount_total || 0) / 100).toFixed(2)}` ||
                        "",
                    productImageSource:
                        session.line_items?.data[0].price?.product?.images[0] ||
                        "",
                }),
            })
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
