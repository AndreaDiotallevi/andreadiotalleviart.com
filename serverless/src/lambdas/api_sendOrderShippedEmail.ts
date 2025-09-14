import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import { sendEmail } from "../actions/ses_sendEmail"
import { getParameterValue } from "../actions/ssm_getParameterValue"
import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"
import { formatCurrency } from "../actions/intl_formatCurrency"
import { StripePrice } from "../types/stripe"

export const handler = async (event: {
    sessionId: string
    carrierName: string
    carrierService: string
    trackingNumber: string
    trackingUrl: string
}): Promise<void> => {
    const {
        sessionId,
        carrierName,
        carrierService,
        trackingNumber,
        trackingUrl,
    } = event

    if (
        !sessionId ||
        !carrierName ||
        !carrierService ||
        !trackingNumber ||
        !trackingUrl
    ) {
        throw new Error("Missing fields in input")
    }

    console.log(JSON.stringify(event))

    const emailSource = await getParameterValue<string>({
        name: "EMAIL_ORDERS",
    })

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

    const items = session.line_items?.data

    if (!items?.length) {
        throw new Error("No items")
    }

    const invoice = session.invoice as Stripe.Invoice | null

    if (!invoice) {
        throw new Error("No invoice")
    }

    const charge = invoice.charge as Stripe.Charge | null

    await sendEmail({
        FromEmailAddress: emailSource,
        Destination: {
            ToAddresses: [session.customer_details.email],
        },
        Content: {
            Template: {
                TemplateName: "OrderShippedEmailTemplate",
                TemplateData: JSON.stringify({
                    name: session.shipping_details?.name || "",
                    addressLine1: address.line1 || "",
                    addressLine2: address.line2 || "",
                    postcode: address.postal_code || "",
                    town: address.city || "",
                    country: address.country || "",
                    paymentMethod: "Card",
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
                    item: items.map(item => {
                        const product = item.price
                            ?.product as unknown as StripePrice["product"]

                        return {
                            displayName: product.metadata.displayName,
                            description: product.description,
                            imageSource: product.images[0],
                            quantity: item.quantity,
                        }
                    }),
                    carrierName,
                    carrierService,
                    trackingNumber,
                    trackingUrl,
                }),
            },
        },
    })
}
