import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses"
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"

import { retrieveCheckoutSession } from "./retrieveCheckoutSession"

const sesClient = new SESClient({ region: process.env.AWS_REGION })
const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

export const sendEmail = async ({ sessionId }: { sessionId: string }) => {
    try {
        const getParameterCommand1 = new GetParameterCommand({
            Name: "EMAIL_SOURCE",
        })
        const { Parameter: param1 } = await ssmClient.send(getParameterCommand1)
        const sourceEmail = param1?.Value as string

        const getParameterCommand2 = new GetParameterCommand({
            Name: "EMAIL_DESTINATION",
        })
        const { Parameter: param2 } = await ssmClient.send(getParameterCommand2)
        const destinationEmail = param2?.Value as string

        const { session, error } = await retrieveCheckoutSession({ sessionId })

        if (error || !session) {
            throw new Error("Error")
        }

        const sendEmailCommand = new SendTemplatedEmailCommand({
            Source: sourceEmail,
            Destination: {
                ToAddresses: [destinationEmail],
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
        console.log("Error sending email")
        console.error(error)
        const errorMessage = "Could not send email"

        return {
            error: errorMessage,
        }
    }
}
