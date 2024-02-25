import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses"

import { getParameterValue } from "./ssm"
import { retrieveCheckoutSession } from "./stripe"

const sesClient = new SESClient({ region: process.env.AWS_REGION })

export const sendEmail = async ({ sessionId }: { sessionId: string }) => {
    try {
        const emailSource = await getParameterValue<string>({
            name: "EMAIL_SOURCE",
        })
        const emailDestination = await getParameterValue<string>({
            name: "EMAIL_DESTINATION",
        })

        const { session } = await retrieveCheckoutSession({ sessionId })

        if (!session) {
            throw new Error("No session")
        }

        const sendEmailCommand = new SendTemplatedEmailCommand({
            Source: emailSource,
            Destination: {
                ToAddresses: [emailDestination],
            },
            Template: "CheckoutSessionCompletedEmailTemplate",
            TemplateData: JSON.stringify({
                name: session.customer_details?.name || "",
                addressLine1: session.shipping_details?.address?.line1 || "",
                addressLine2: session.shipping_details?.address?.line2 || "",
                postcode: session.shipping_details?.address?.postal_code || "",
                town: session.shipping_details?.address?.city || "",
                country: session.shipping_details?.address?.country || "",
                paymentMethod: "Card",
                productName:
                    session.line_items?.data[0].price?.product.name || "",
                productDescription:
                    session.line_items?.data[0].price?.product.description ||
                    "",
                itemQuantity: session.line_items?.data[0].quantity || "",
                amountSubtotal:
                    `£${((session.amount_subtotal || 0) / 100).toFixed(2)}` ||
                    "",
                amountDiscount:
                    `£${(
                        (session.total_details?.amount_discount || 0) / 100
                    ).toFixed(2)}` || "",
                amountTotal:
                    `£${((session.amount_total || 0) / 100).toFixed(2)}` || "",
                productImageSource:
                    session.line_items?.data[0].price?.product?.images[0] || "",
            }),
        })

        const response = await sesClient.send(sendEmailCommand)
        console.log(response)

        return { error: null }
    } catch (error) {
        console.error(error)
        throw error
    }
}
