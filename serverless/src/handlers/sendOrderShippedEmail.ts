import { SQSEvent } from "aws-lambda"

import { sendEmail } from "../services/ses"
import { getParameterValue } from "../services/ssm"
import { ProdigiEvent } from "../services/prodigi"
import { retrieveCheckoutSession } from "../services/stripe"

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
                    productName: line_items?.data[0].price?.product.name || "",
                    productDescription:
                        line_items?.data[0].price?.product.description || "",
                    productImageSource:
                        line_items?.data[0].price?.product?.images[0] || "",
                }),
            })
        }
        return
    } catch (error) {
        console.error(error)
        throw error
    }
}
