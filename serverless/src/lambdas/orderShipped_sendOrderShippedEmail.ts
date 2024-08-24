import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import { sendEmail } from "../actions/ses_sendEmail"
import { getParameterValue } from "../actions/ssm_getParameterValue"
import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"

import { ProdigiEvent } from "../types/prodigi"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)
            const event = body.detail as ProdigiEvent

            console.log(JSON.stringify(event))

            if (!event.data.order.recipient.email) {
                throw new Error("No customer email")
            }

            const {
                session: { line_items },
            } = await retrieveCheckoutSession({
                sessionId: event.data.order.merchantReference,
            })

            const product = line_items?.data[0].price?.product as Stripe.Product

            const {
                data: {
                    order: { recipient, shipments },
                },
            } = event

            const emailSource = await getParameterValue<string>({
                name: "EMAIL_ORDERS",
            })

            await sendEmail({
                Source: emailSource,
                Destination: {
                    ToAddresses: [event.data.order.recipient.email],
                },
                Template: "OrderShippedEmailTemplate",
                TemplateData: JSON.stringify({
                    name: recipient.name || "",
                    carrierName: shipments[0].carrier.name || "",
                    carrierService: shipments[0].carrier.service || "",
                    trackingNumber: shipments[0].tracking.number || "",
                    trackingUrl: shipments[0].tracking.url || "",
                    addressLine1: recipient.address.line1 || "",
                    addressLine2: recipient.address.line2 || "",
                    postcode: recipient.address.postalOrZipCode || "",
                    town: recipient.address.townOrCity || "",
                    country: recipient.address.stateOrCounty || "",
                    productDisplayName: product.metadata.displayName || "",
                    productDescription: product.description || "",
                    productImageSource: product.images[0] || "",
                }),
            })
        }
        return
    } catch (error) {
        console.error(error)
        throw error
    }
}
