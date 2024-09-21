import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import { sendEmail } from "../actions/ses_sendEmail"
import { getParameterValue } from "../actions/ssm_getParameterValue"
import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"
import { formatCurrency } from "../actions/intl_formatCurrency"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)
            const event = body.detail as Stripe.CheckoutSessionCompletedEvent
            console.log(JSON.stringify(event))

            const emailSource = await getParameterValue<string>({
                name: "EMAIL_ORDERS",
            })

            const sessionId = event.data.object.id
            const { session } = await retrieveCheckoutSession({ sessionId })
            console.log(JSON.stringify(session))

            if (!session) {
                throw new Error("No session")
            }

            if (!session.customer_details?.email) {
                throw new Error("No customer email")
            }

            if (!session.currency) {
                throw new Error("No currency")
            }

            const address = session.shipping_details?.address

            if (!address) {
                throw new Error("No shipping address")
            }

            const product = session.line_items?.data[0].price?.product as
                | Stripe.Product
                | undefined

            if (!product) {
                throw new Error("No product")
            }

            const invoice = session.invoice as Stripe.Invoice | null

            if (!invoice) {
                throw new Error("No invoice")
            }

            const charge = invoice.charge as Stripe.Charge | null

            await sendEmail({
                Source: emailSource,
                Destination: {
                    ToAddresses: [session.customer_details.email],
                },
                Template: "OrderConfirmationEmailTemplate",
                TemplateData: JSON.stringify({
                    name: session.customer_details?.name || "",
                    addressLine1: address.line1 || "",
                    addressLine2: address.line2 || "",
                    postcode: address.postal_code || "",
                    town: address.city || "",
                    country: address.country || "",
                    paymentMethod: "Card",
                    productDisplayName: product.metadata.displayName || "",
                    productDescription: product.description || "",
                    productImageSource: product.images[0] || "",
                    itemQuantity: session.line_items?.data[0].quantity || "",
                    amountSubtotal: formatCurrency({
                        value: session.amount_subtotal!,
                        currency: session.currency,
                    }),
                    amountDiscount: formatCurrency({
                        value: session.total_details?.amount_discount!,
                        currency: session.currency,
                    }),
                    amountTotal: formatCurrency({
                        value: session.amount_total!,
                        currency: session.currency,
                    }),
                    receiptPdf: charge?.receipt_url?.replace("?", "/pdf?"),
                }),
            })
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
