import { SQSEvent } from "aws-lambda"
import Stripe from "stripe"

import { formatCurrency } from "../actions/intl_formatCurrency"
import { sendEmail } from "../actions/ses_sendEmail"
import { getFulfilmentLines } from "../actions/fulfilment"
import { getParameterValue } from "../actions/ssm_getParameterValue"
import { retrieveCheckoutSession } from "../actions/stripe_retrieveCheckoutSession"

const londonDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
})

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body)
            const stripeEvent =
                body.detail as Stripe.CheckoutSessionCompletedEvent

            const { session, error } = await retrieveCheckoutSession({
                sessionId: stripeEvent.data.object.id,
            })

            if (!session) {
                throw new Error(error ?? "No session")
            }

            if (!session.currency) {
                throw new Error("No currency")
            }

            const orderNumber = session.metadata?.orderNumber
            if (!orderNumber) {
                throw new Error("No order number")
            }

            const emailSource = await getParameterValue<string>({
                name: "EMAIL_ORDERS",
            })
            const adminEmail = await getParameterValue<string>({
                name: "EMAIL_ANDREA",
            })
            const adminBaseUrl = process.env.ADMIN_BASE_URL

            const lines = getFulfilmentLines(session)
            const currency = session.currency

            await sendEmail({
                FromEmailAddress: emailSource,
                Destination: {
                    ToAddresses: [adminEmail],
                },
                Content: {
                    Template: {
                        TemplateName: "AdminNewOrderEmailTemplate",
                        TemplateData: JSON.stringify({
                            orderNumber,
                            purchasedAt: londonDateTimeFormatter.format(
                                new Date(session.created * 1000),
                            ),
                            country:
                                session.shipping_details?.address?.country ??
                                "—",
                            item: lines.map(line => ({
                                displayName: line.displayName,
                                sku: line.sku ?? "—",
                                quantity: line.quantity,
                                amount: formatCurrency({
                                    value: line.amountTotal ?? 0,
                                    currency,
                                }),
                                variantMissing: line.variantId === null,
                            })),
                            amountSubtotal: formatCurrency({
                                value: session.amount_subtotal ?? 0,
                                currency,
                            }),
                            amountDiscount: formatCurrency({
                                value:
                                    session.total_details?.amount_discount ?? 0,
                                currency,
                            }),
                            amountTotal: formatCurrency({
                                value: session.amount_total ?? 0,
                                currency,
                            }),
                            adminUrl: `${adminBaseUrl}/admin/orders/${session.id}`,
                        }),
                    },
                },
            })
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
