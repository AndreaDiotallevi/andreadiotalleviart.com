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

            if (!session) {
                throw new Error("No session")
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

            type Currency =
                | "eur"
                | "gbp"
                | "usd"
                | "chf"
                | "nok"
                | "dkk"
                | "sek"

            const currencyToSymbol: Record<Currency, string> = {
                eur: "€",
                gbp: "£",
                usd: "$",
                chf: "₣", // Switzerland
                nok: "kr", // Norway
                dkk: "kr", // Denmark
                sek: "kr", // Sweden
            }

            const currencySymbol =
                currencyToSymbol[(session?.currency as Currency) || "gbp"]

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
                    amountSubtotal:
                        `${currencySymbol}${(
                            (session.amount_subtotal || 0) / 100
                        ).toFixed(2)}` || "",
                    amountDiscount:
                        `${currencySymbol}${(
                            (session.total_details?.amount_discount || 0) / 100
                        ).toFixed(2)}` || "",
                    amountTotal:
                        `${currencySymbol}${(
                            (session.amount_total || 0) / 100
                        ).toFixed(2)}` || "",
                    receiptPdf: charge?.receipt_url?.replace("?", "/pdf?"),
                }),
            })
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
